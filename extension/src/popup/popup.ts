import type { MediaSnapshot, PageMediaState, UserSettings } from "@speedpilot/shared";
import { formatDuration, remainingRealTime, estimateTimeSavedRemaining, normalizeSpeed } from "@speedpilot/shared";
import { getSettings, upsertSiteRule, removeSiteRule } from "../lib/storage";
import { sendMessage } from "../lib/messaging";
import { el, clear, applyTheme } from "../lib/dom";

const content = document.getElementById("content") as HTMLDivElement;

let settings: UserSettings;
let pageState: PageMediaState | null = null;

async function init(): Promise<void> {
  settings = await getSettings();
  applyTheme(settings.theme);
  renderLoading();
  pageState = await sendMessage<PageMediaState>({ type: "GET_PAGE_STATE" });
  render();
}

function renderLoading(): void {
  clear(content);
  content.append(
    el("div", { className: "state-panel" }, [
      el("div", { className: "state-icon" }, ["⏳"]),
      el("h2", {}, ["Looking for media…"]),
    ])
  );
}

function renderUnsupported(): void {
  clear(content);
  content.append(
    el("div", { className: "state-panel" }, [
      el("div", { className: "state-icon" }, ["🚫"]),
      el("h2", {}, ["SpeedPilot isn't available here"]),
      el("p", {}, ["This page doesn't allow extensions to run (e.g. a browser settings page or the Web Store)."]),
    ])
  );
}

function renderEmpty(hostname: string): void {
  clear(content);
  content.append(
    el("div", { className: "state-panel" }, [
      el("div", { className: "state-icon" }, ["🎬"]),
      el("h2", {}, ["No media detected"]),
      el("p", {}, [`Play a video or audio on ${hostname} and SpeedPilot will detect it automatically.`]),
    ])
  );
}

function activeMedia(state: PageMediaState): MediaSnapshot | null {
  return state.media.find((m) => m.id === state.activeMediaId) ?? state.media[0] ?? null;
}

function render(): void {
  if (!pageState) {
    renderUnsupported();
    return;
  }
  if (pageState.media.length === 0) {
    renderEmpty(pageState.hostname);
    return;
  }
  renderControls(pageState);
}

function renderControls(state: PageMediaState): void {
  const media = activeMedia(state);
  if (!media) {
    renderEmpty(state.hostname);
    return;
  }

  clear(content);

  const siteRow = el("div", { className: "site-row" }, [
    el("span", { className: "site-name" }, [state.hostname]),
    el("span", { className: "media-kind-badge" }, [media.kind === "audio" ? "Audio" : "Video"]),
  ]);
  const siteHeader = el("div", {}, [
    siteRow,
    state.siteRule?.enabled
      ? el("div", { className: "site-rule-badge" }, [el("span", { className: "dot" }, ["●"]), `Site speed: ${state.siteRule.speed}×`])
      : null,
  ]);

  const selectorNodes: HTMLElement[] = [];
  if (state.media.length > 1) {
    const select = el("select", { className: "media-select" }) as HTMLSelectElement;
    state.media.forEach((m, i) => {
      const opt = el("option", { value: m.id }, [`${m.kind === "audio" ? "Audio" : "Video"} ${i + 1}${m.id === state.activeMediaId ? " (active)" : ""}`]) as HTMLOptionElement;
      if (m.id === media.id) opt.selected = true;
      select.append(opt);
    });
    select.addEventListener("change", async () => {
      pageState = await sendMessage<PageMediaState>({ type: "SELECT_MEDIA", payload: { mediaId: select.value } });
      render();
    });
    selectorNodes.push(select);
  }

  const speedValue = el("div", { className: "speed-value" }, [
    `${media.playbackRate.toFixed(2)}×`,
    media.isLive ? el("span", { className: "live-badge" }, ["LIVE"]) : null,
  ]);
  const speedReadout = el("div", { className: "speed-readout" }, [speedValue]);

  const minus = el("button", { className: "step-btn", type: "button" }, ["−"]) as HTMLButtonElement;
  minus.setAttribute("aria-label", "Decrease speed");
  const plus = el("button", { className: "step-btn", type: "button" }, ["+"]) as HTMLButtonElement;
  plus.setAttribute("aria-label", "Increase speed");
  minus.addEventListener("click", () => step("decrease"));
  plus.addEventListener("click", () => step("increase"));
  const stepper = el("div", { className: "stepper" }, [minus, plus]);

  const unavailableNote = media.speedControlAvailable
    ? null
    : el("div", { className: "unavailable-note" }, ["⚠", " Speed control isn't available for this player."]);

  const slider = el("input", {
    className: "speed-slider",
    type: "range",
    min: "0.25",
    max: "3",
    step: "0.05",
  }) as HTMLInputElement;
  slider.value = String(Math.min(3, Math.max(0.25, media.playbackRate)));
  slider.setAttribute("aria-label", "Playback speed");
  slider.addEventListener("input", () => {
    void setSpeed(parseFloat(slider.value), "current");
  });

  const presets = el(
    "div",
    { className: "presets" },
    settings.presets.map((p) => {
      const btn = el("button", { className: `preset-btn${Math.abs(p - media.playbackRate) < 0.01 ? " active" : ""}`, type: "button" }, [
        `${p}×`,
      ]) as HTMLButtonElement;
      btn.addEventListener("click", () => void setSpeed(p, "current"));
      return btn;
    })
  );

  const rewindBtn = el("button", { className: "seek-btn", type: "button" }, [`↶ ${settings.rewindSeconds}s`]) as HTMLButtonElement;
  const forwardBtn = el("button", { className: "seek-btn", type: "button" }, [`↷ ${settings.forwardSeconds}s`]) as HTMLButtonElement;
  rewindBtn.addEventListener("click", () => void seek("rewind"));
  forwardBtn.addEventListener("click", () => void seek("forward"));
  const seekRow = el("div", { className: "seek-row" }, [rewindBtn, forwardBtn]);

  const infoPanel = renderInfoPanel(media);

  const rememberRow = el("label", { className: "check-row" }) as HTMLLabelElement;
  const rememberCheckbox = el("input", { type: "checkbox" }) as HTMLInputElement;
  rememberCheckbox.checked = Boolean(state.siteRule?.enabled);
  rememberCheckbox.addEventListener("change", () => void toggleSiteRule(rememberCheckbox.checked, media.playbackRate));
  rememberRow.append(rememberCheckbox, document.createTextNode(`Remember ${normalizeSpeed(media.playbackRate)}× for this site`));

  const applyAllBtn = el("button", { className: "action-btn", type: "button" }, ["Apply to all media on this page"]) as HTMLButtonElement;
  applyAllBtn.disabled = state.media.length < 2;
  applyAllBtn.addEventListener("click", () => void setSpeed(media.playbackRate, "all"));

  const sidePanelBtn = el("button", { className: "action-btn primary", type: "button" }, ["Open side panel"]) as HTMLButtonElement;
  sidePanelBtn.addEventListener("click", openSidePanel);

  // content.append() would stringify a bare null/undefined into a literal "null"
  // text node — filter optional nodes out before spreading them in.
  const children: (Node | null)[] = [
    siteHeader,
    el("hr", { className: "divider" }),
    ...selectorNodes,
    speedReadout,
    stepper,
    unavailableNote,
    slider,
    presets,
    seekRow,
    infoPanel,
    rememberRow,
    applyAllBtn,
    sidePanelBtn,
  ];
  content.append(...children.filter((node): node is Node => node !== null));
}

function renderInfoPanel(media: MediaSnapshot): HTMLElement {
  if (media.isLive) {
    return el("div", { className: "info-panel" }, [
      el("div", { className: "info-row" }, [el("span", {}, ["Live playback"]), el("strong", {}, ["● LIVE"])]),
    ]);
  }

  const positionRow = el("div", { className: "info-row" }, [
    el("span", {}, ["Position"]),
    el("strong", {}, [`${formatDuration(media.currentTime)} / ${formatDuration(media.duration)}`]),
  ]);

  const remaining = remainingRealTime({ duration: media.duration, currentTime: media.currentTime, playbackRate: media.playbackRate });
  const saved = estimateTimeSavedRemaining({ duration: media.duration, currentTime: media.currentTime, playbackRate: media.playbackRate });
  const remainingParts: (Node | string)[] = [el("span", {}, ["Remaining"]), el("strong", {}, [remaining === null ? "—" : `~${formatDuration(remaining)}`])];
  const remainingRow = el("div", { className: "info-row" }, remainingParts);
  if (saved > 30) {
    remainingRow.append(el("span", { className: "saved-hint" }, [`saves ~${formatDuration(saved)}`]));
  }

  return el("div", { className: "info-panel" }, [positionRow, remainingRow]);
}

async function step(direction: "increase" | "decrease"): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "STEP_SPEED", payload: { direction } });
  render();
}

async function seek(direction: "rewind" | "forward"): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "SEEK", payload: { direction } });
  render();
}

async function setSpeed(speed: number, target: "current" | "all"): Promise<void> {
  pageState = await sendMessage<PageMediaState>({ type: "SET_SPEED", payload: { speed, target } });
  render();
}

async function toggleSiteRule(enabled: boolean, currentSpeed: number): Promise<void> {
  if (!pageState) return;
  const hostname = pageState.hostname;
  if (enabled) {
    const speed = normalizeSpeed(currentSpeed);
    await upsertSiteRule({ hostname, enabled: true, speed });
    showToast(`Remembering ${speed}× for ${hostname}`);
  } else {
    await removeSiteRule(hostname);
    showToast(`Stopped remembering a speed for ${hostname}`);
  }
  pageState = await sendMessage<PageMediaState>({ type: "GET_PAGE_STATE" });
  render();
}

let toastEl: HTMLDivElement | null = null;
let toastTimer: number | null = null;

function showToast(message: string): void {
  if (!toastEl) {
    toastEl = el("div", { className: "toast" }) as HTMLDivElement;
    document.body.append(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add("visible");
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove("visible"), 1800);
}

async function openSidePanel(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.windowId) return;
  await chrome.sidePanel.open({ windowId: tab.windowId });
  window.close();
}

document.getElementById("open-options")?.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
document.getElementById("open-sidepanel")?.addEventListener("click", () => void openSidePanel());

void init();
