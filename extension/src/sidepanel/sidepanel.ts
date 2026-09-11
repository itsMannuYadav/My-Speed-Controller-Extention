import type { MediaSnapshot, PageMediaState, UserSettings } from "@speedpilot/shared";
import { formatDuration, remainingRealTime, estimateTimeSavedRemaining, normalizeSpeed } from "@speedpilot/shared";
import { getSettings, upsertSiteRule, removeSiteRule } from "../lib/storage";
import { sendMessage } from "../lib/messaging";
import { el, clear, applyTheme } from "../lib/dom";

const content = document.getElementById("content") as HTMLDivElement;

let settings: UserSettings;
let pageState: PageMediaState | null = null;

async function refresh(): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "GET_PAGE_STATE" });
  render();
}

async function init(): Promise<void> {
  settings = await getSettings();
  applyTheme(settings.theme);
  await refresh();

  // The side panel can stay open while the user switches tabs or navigates —
  // keep it in sync with whichever tab is now active/loaded, event-driven only.
  chrome.tabs.onActivated.addListener(() => void refresh());
  chrome.tabs.onUpdated.addListener((_id, info) => {
    if (info.status === "complete") void refresh();
  });
}

function activeMedia(state: PageMediaState): MediaSnapshot | null {
  return state.media.find((m) => m.id === state.activeMediaId) ?? state.media[0] ?? null;
}

function render(): void {
  clear(content);
  if (!pageState) {
    content.append(
      el("div", { className: "state-panel" }, [
        el("div", { className: "state-icon" }, ["🚫"]),
        el("h2", {}, ["Not available here"]),
      ])
    );
    return;
  }
  if (pageState.media.length === 0) {
    content.append(
      el("div", { className: "state-panel" }, [
        el("div", { className: "state-icon" }, ["🎬"]),
        el("h2", {}, ["No media detected"]),
      ])
    );
    return;
  }
  const media = activeMedia(pageState);
  if (!media) return;

  content.append(
    renderPageSection(pageState),
    renderMediaSection(pageState),
    renderPlaybackSection(media),
    renderActionsSection(pageState, media),
    renderInfoSection(media),
    renderSiteRuleSection(pageState, media)
  );
}

function section(title: string, children: (Node | string)[]): HTMLElement {
  return el("div", { className: "panel-section" }, [el("h3", {}, [title]), ...children]);
}

function renderPageSection(state: PageMediaState): HTMLElement {
  const children: (Node | string)[] = [el("div", {}, [state.hostname])];
  if (state.siteRule?.enabled) {
    children.push(el("div", { className: "site-rule-badge" }, [`● Site speed: ${state.siteRule.speed}×`]));
  }
  return section("Current page", children);
}

function renderMediaSection(state: PageMediaState): HTMLElement {
  const list = el(
    "div",
    { className: "media-list" },
    state.media.map((m, i) => {
      const btn = el("button", { className: `media-option${m.id === state.activeMediaId ? " active" : ""}`, type: "button" }, [
        el("span", { className: "dot" }),
        `${m.kind === "audio" ? "Audio" : "Video"} ${i + 1}`,
      ]) as HTMLButtonElement;
      btn.addEventListener("click", () => void selectMedia(m.id));
      return btn;
    })
  );
  return section(`Detected media (${state.media.length})`, [list]);
}

function renderPlaybackSection(media: MediaSnapshot): HTMLElement {
  const value = el("div", { className: "speed-value-lg" }, [`${media.playbackRate.toFixed(2)}×`]);
  const slider = el("input", { className: "speed-slider", type: "range", min: "0.25", max: "4.5", step: "0.05" }) as HTMLInputElement;
  slider.value = String(Math.min(4.5, Math.max(0.25, media.playbackRate)));
  slider.setAttribute("aria-label", "Playback speed");
  slider.addEventListener("input", () => void setSpeed(parseFloat(slider.value), "current"));

  const presets = el(
    "div",
    { className: "presets" },
    settings.presets.map((p) => {
      const btn = el("button", { className: `preset-btn${Math.abs(p - media.playbackRate) < 0.01 ? " active" : ""}`, type: "button" }, [`${p}×`]) as HTMLButtonElement;
      btn.addEventListener("click", () => void setSpeed(p, "current"));
      return btn;
    })
  );

  const unavailableNote = media.speedControlAvailable
    ? null
    : el("div", { className: "unavailable-note" }, ["⚠ Speed control isn't available for this player."]);

  const children: (Node | null)[] = [value, unavailableNote, slider, presets];
  return section(
    "Playback",
    children.filter((n): n is Node => n !== null)
  );
}

function renderActionsSection(state: PageMediaState, media: MediaSnapshot): HTMLElement {
  const rewind = el("button", { className: "action-btn", type: "button" }, [`↶ ${settings.rewindSeconds}s`]) as HTMLButtonElement;
  rewind.addEventListener("click", () => void seek("rewind"));
  const forward = el("button", { className: "action-btn", type: "button" }, [`↷ ${settings.forwardSeconds}s`]) as HTMLButtonElement;
  forward.addEventListener("click", () => void seek("forward"));

  const pip = el("button", { className: "action-btn", type: "button" }, [media.isPictureInPicture ? "Exit PiP" : "Picture-in-Picture"]) as HTMLButtonElement;
  pip.disabled = !media.supportsPiP;
  pip.title = media.supportsPiP ? "" : "Picture-in-Picture isn't available for this media.";
  pip.addEventListener("click", () => void requestPiP(media.id));

  const focus = el("button", { className: "action-btn", type: "button" }, ["Focus mode"]) as HTMLButtonElement;
  focus.addEventListener("click", () => void toggleFocusMode());

  const applyAll = el("button", { className: "action-btn", type: "button" }, ["Apply to all media"]) as HTMLButtonElement;
  applyAll.disabled = state.media.length < 2;
  applyAll.addEventListener("click", () => void setSpeed(media.playbackRate, "all"));

  const reset = el("button", { className: "action-btn", type: "button" }, ["Reset to 1×"]) as HTMLButtonElement;
  reset.addEventListener("click", () => void resetSpeed());

  return section("Actions", [el("div", { className: "actions-grid" }, [rewind, forward, pip, focus, applyAll, reset])]);
}

function renderInfoSection(media: MediaSnapshot): HTMLElement {
  const rows: HTMLElement[] = [];
  rows.push(row("Position", media.isLive ? "LIVE" : `${formatDuration(media.currentTime)} / ${formatDuration(media.duration)}`));
  if (media.isLive) {
    rows.push(row("Status", "Live playback"));
  } else {
    const remaining = remainingRealTime({ duration: media.duration, currentTime: media.currentTime, playbackRate: media.playbackRate });
    rows.push(row("Remaining", remaining === null ? "—" : `~${formatDuration(remaining)}`));
    const saved = estimateTimeSavedRemaining({ duration: media.duration, currentTime: media.currentTime, playbackRate: media.playbackRate });
    if (saved > 30) rows.push(row("Time saved", `~${formatDuration(saved)}`));
  }
  return section("Playback info", [el("div", { className: "info-grid" }, rows)]);
}

function row(label: string, value: string): HTMLElement {
  return el("div", { className: "row" }, [el("span", {}, [label]), el("strong", {}, [value])]);
}

function renderSiteRuleSection(state: PageMediaState, media: MediaSnapshot): HTMLElement {
  const checkbox = el("input", { type: "checkbox", checked: Boolean(state.siteRule?.enabled) }) as HTMLInputElement;
  const speedInput = el("input", { type: "number", min: "0.05", max: "16", step: "0.05", value: String(state.siteRule?.speed ?? normalizeSpeed(media.playbackRate)) }) as HTMLInputElement;
  speedInput.disabled = !checkbox.checked;

  checkbox.addEventListener("change", () => {
    speedInput.disabled = !checkbox.checked;
    void applySiteRule(checkbox.checked, parseFloat(speedInput.value));
  });
  speedInput.addEventListener("change", () => {
    if (checkbox.checked) void applySiteRule(true, parseFloat(speedInput.value));
  });

  return section("Site rule", [
    el("label", { className: "rule-box" }, [checkbox, document.createTextNode("Always use"), speedInput, document.createTextNode("×")]),
  ]);
}

async function applySiteRule(enabled: boolean, speed: number): Promise<void> {
  if (!pageState) return;
  if (enabled) {
    await upsertSiteRule({ hostname: pageState.hostname, enabled: true, speed: normalizeSpeed(speed || 1) });
  } else {
    await removeSiteRule(pageState.hostname);
  }
  await refresh();
}

async function selectMedia(mediaId: string): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "SELECT_MEDIA", payload: { mediaId } });
  render();
}

async function setSpeed(speed: number, target: "current" | "all"): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "SET_SPEED", payload: { speed, target } });
  render();
}

async function resetSpeed(): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "RESET_SPEED" });
  render();
}

async function seek(direction: "rewind" | "forward"): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "SEEK", payload: { direction } });
  render();
}

async function requestPiP(mediaId: string): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "REQUEST_PIP", payload: { mediaId } });
  render();
}

async function toggleFocusMode(): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "TOGGLE_FOCUS_MODE" });
  render();
}

document.getElementById("open-options")?.addEventListener("click", () => chrome.runtime.openOptionsPage());

void init();
