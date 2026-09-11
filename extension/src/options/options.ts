import type { SiteRule, ShortcutAction, UserSettings } from "@speedpilot/shared";
import { DEFAULT_SETTINGS, FUTURE_FEATURES } from "@speedpilot/shared";
import { clampSeconds, clampSpeed, clampStep, isValidHostname, sanitizePresets } from "@speedpilot/shared";
import { getSettings, saveSettings, getSiteRules, upsertSiteRule, removeSiteRule, clearSiteRules } from "../lib/storage";
import { el, clear, applyTheme } from "../lib/dom";

const main = document.getElementById("main") as HTMLElement;

let settings: UserSettings = DEFAULT_SETTINGS;
let siteRules: SiteRule[] = [];

async function init(): Promise<void> {
  settings = await getSettings();
  siteRules = await getSiteRules();
  applyTheme(settings.theme);
  renderAll();
}

async function persist(next: Partial<UserSettings>): Promise<void> {
  settings = await saveSettings({ ...settings, ...next });
  applyTheme(settings.theme);
  showToast("Saved");
  renderAll();
}

function showToast(message: string): void {
  let toast = document.querySelector<HTMLDivElement>(".save-toast");
  if (!toast) {
    toast = el("div", { className: "save-toast" }, []) as HTMLDivElement;
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast!.classList.remove("visible"), 1400);
}

function renderAll(): void {
  clear(main);
  main.append(renderGeneralSection(), renderPresetsSection(), renderShortcutsSection(), renderSiteRulesSection(), renderFutureSection());
}

// ---------- General ----------
function renderGeneralSection(): HTMLElement {
  const section = el("section", { className: "card" }, [el("h2", {}, ["General"])]);

  section.append(
    fieldSelect("Theme", "Choose light, dark, or match your system.", settings.theme, [
      ["system", "Match system"],
      ["light", "Light"],
      ["dark", "Dark"],
    ], (value) => void persist({ theme: value as UserSettings["theme"] })),

    fieldSelect("Default speed", "Applied when a site has no saved rule.", String(settings.defaultSpeed), presetOptions(), (value) =>
      void persist({ defaultSpeed: clampSpeed(parseFloat(value), 1) })
    ),

    fieldNumber("Speed step", "How much +/- and the increase/decrease shortcuts change speed by.", settings.speedStep, 0.01, 2, 0.05, (value) =>
      void persist({ speedStep: clampStep(value, DEFAULT_SETTINGS.speedStep) })
    ),

    fieldNumber("Rewind seconds", "How far the rewind shortcut/button skips back.", settings.rewindSeconds, 1, 600, 1, (value) =>
      void persist({ rewindSeconds: clampSeconds(value, DEFAULT_SETTINGS.rewindSeconds) })
    ),

    fieldNumber("Forward seconds", "How far the forward shortcut/button skips ahead.", settings.forwardSeconds, 1, 600, 1, (value) =>
      void persist({ forwardSeconds: clampSeconds(value, DEFAULT_SETTINGS.forwardSeconds) })
    ),

    fieldSelect("Apply speed changes to", "Whether the popup targets just the active video or every video on the page by default.", settings.defaultSelectionMode, [
      ["current", "Current media only"],
      ["all", "All media on the page"],
    ], (value) => void persist({ defaultSelectionMode: value as UserSettings["defaultSelectionMode"] })),

    fieldToggle("Remember speed per site", "Automatically re-apply a site's saved speed when you return to it.", settings.rememberSiteSpeed, (checked) =>
      void persist({ rememberSiteSpeed: checked })
    ),

    fieldToggle("Keep my selected speed", "If a website resets the playback rate on its own, restore your chosen speed.", settings.lockSpeed, (checked) =>
      void persist({ lockSpeed: checked })
    ),

    fieldToggle("Show on-video controller", "A small floating −/+ control over the video itself.", settings.showOverlay, (checked) =>
      void persist({ showOverlay: checked })
    ),

    fieldSelect("Controller visibility", "When the on-video controller appears.", settings.overlayMode, [
      ["always", "Always visible"],
      ["hover", "On hover"],
      ["autohide", "Show briefly, then auto-hide"],
      ["disabled", "Disabled"],
    ], (value) => void persist({ overlayMode: value as UserSettings["overlayMode"] })),

    fieldAction(
      "Controller position",
      settings.overlayOffsetX === 0 && settings.overlayOffsetY === 0
        ? "Drag the on-video controller anywhere — it remembers where you leave it."
        : "You've moved the controller from its default spot.",
      "Reset position",
      () => void persist({ overlayOffsetX: 0, overlayOffsetY: 0 }),
      settings.overlayOffsetX === 0 && settings.overlayOffsetY === 0
    ),

    fieldToggle(
      "Sync settings across devices",
      "Mirrors these settings and your site rules (never browsing history or video content) to your browser's sync storage. Off by default.",
      settings.syncEnabled,
      (checked) => void persist({ syncEnabled: checked })
    )
  );

  return section;
}

function presetOptions(): [string, string][] {
  const values = new Set([...settings.presets, settings.defaultSpeed]);
  return Array.from(values)
    .sort((a, b) => a - b)
    .map((v) => [String(v), `${v}×`] as [string, string]);
}

// ---------- Presets ----------
function swapPresets(index: number, direction: -1 | 1): number[] {
  const next = [...settings.presets];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function renderPresetsSection(): HTMLElement {
  const section = el("section", { className: "card" }, [
    el("h2", {}, ["Speed presets"]),
    el("p", { className: "card-desc" }, ["Quick-access speeds shown in the popup and side panel, in this order. Use the arrows to reorder them."]),
  ]);

  const chipList = el(
    "div",
    { className: "chip-list" },
    settings.presets.map((p, i) => {
      const moveLeft = el("button", { type: "button" }, ["◀"]) as HTMLButtonElement;
      moveLeft.disabled = i === 0;
      moveLeft.setAttribute("aria-label", `Move ${p}× earlier`);
      moveLeft.addEventListener("click", () => void persist({ presets: swapPresets(i, -1) }));

      const moveRight = el("button", { type: "button" }, ["▶"]) as HTMLButtonElement;
      moveRight.disabled = i === settings.presets.length - 1;
      moveRight.setAttribute("aria-label", `Move ${p}× later`);
      moveRight.addEventListener("click", () => void persist({ presets: swapPresets(i, 1) }));

      const removeBtn = el("button", { type: "button" }, ["×"]) as HTMLButtonElement;
      removeBtn.setAttribute("aria-label", `Remove ${p}× preset`);
      removeBtn.addEventListener("click", () => void persist({ presets: settings.presets.filter((_, idx) => idx !== i) }));

      return el("span", { className: "chip" }, [moveLeft, `${p}×`, moveRight, removeBtn]);
    })
  );

  const form = el("form", { className: "add-chip-form" }) as HTMLFormElement;
  const input = el("input", { type: "number", min: "0.05", max: "16", step: "0.05", placeholder: "e.g. 1.6" }) as HTMLInputElement;
  const addBtn = el("button", { type: "submit", className: "btn" }, ["Add preset"]) as HTMLButtonElement;
  form.append(input, addBtn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = clampSpeed(parseFloat(input.value), NaN);
    if (Number.isNaN(value)) return;
    void persist({ presets: sanitizePresets([...settings.presets, value], settings.presets) });
    input.value = "";
  });

  section.append(chipList, form);
  return section;
}

// ---------- Shortcuts ----------
const SHORTCUT_LABELS: Record<ShortcutAction, string> = {
  increase: "Increase speed",
  decrease: "Decrease speed",
  reset: "Reset to 1×",
  rewind: "Rewind",
  forward: "Forward",
  toggleController: "Toggle on-video controller",
};

function renderShortcutsSection(): HTMLElement {
  const section = el("section", { className: "card" }, [
    el("h2", {}, ["Keyboard shortcuts"]),
    el(
      "p",
      { className: "card-desc" },
      [
        "Work on the page itself (not while typing in a text field). These are separate from Chrome/Edge's own browser-level shortcut for this extension — manage that at ",
        (() => {
          const link = el("a", { href: "#" }, ["chrome://extensions/shortcuts"]) as HTMLAnchorElement;
          link.addEventListener("click", (e) => {
            e.preventDefault();
            void chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
          });
          return link;
        })(),
        ". SpeedPilot can't override shortcuts the browser itself reserves.",
      ]
    ),
  ]);

  for (const action of Object.keys(SHORTCUT_LABELS) as ShortcutAction[]) {
    const binding = settings.shortcuts[action];
    const keyInput = el("input", { className: "key-input", type: "text", maxLength: 1, value: binding.key.toUpperCase() }) as HTMLInputElement;
    keyInput.addEventListener("change", () => {
      const key = keyInput.value.trim().slice(0, 1).toLowerCase() || binding.key;
      void persist({ shortcuts: { ...settings.shortcuts, [action]: { ...binding, key } } });
    });

    const toggle = buildToggle(binding.enabled, (checked) =>
      void persist({ shortcuts: { ...settings.shortcuts, [action]: { ...binding, enabled: checked } } })
    );

    section.append(
      el("div", { className: "field-row shortcut-row" }, [
        el("div", { className: "field-label" }, [el("strong", {}, [SHORTCUT_LABELS[action]])]),
        el("div", { style: "display:flex;align-items:center;gap:10px" }, [keyInput, toggle]),
      ])
    );
  }

  return section;
}

// ---------- Site rules ----------
function renderSiteRulesSection(): HTMLElement {
  const section = el("section", { className: "card" }, [
    el("h2", {}, ["Site rules"]),
    el("p", { className: "card-desc" }, ["A saved speed per website. The popup's “Remember for this site” checkbox writes here too."]),
  ]);

  if (siteRules.length === 0) {
    section.append(el("p", { className: "empty-note" }, ["No saved sites yet."]));
  } else {
    const table = el("table", { className: "rules-table" }, [
      el("thead", {}, [el("tr", {}, [el("th", {}, ["Site"]), el("th", {}, ["Speed"]), el("th", {}, ["Enabled"]), el("th", {}, [""])])]),
    ]) as HTMLTableElement;
    const tbody = el("tbody", {});
    for (const rule of siteRules) {
      const speedInput = el("input", { type: "number", min: "0.05", max: "16", step: "0.05", value: String(rule.speed) }) as HTMLInputElement;
      speedInput.addEventListener("change", () =>
        void updateSiteRules(async () => {
          await upsertSiteRule({ ...rule, speed: clampSpeed(parseFloat(speedInput.value), rule.speed) });
        })
      );
      const enabledToggle = buildToggle(rule.enabled, (checked) =>
        void updateSiteRules(async () => {
          await upsertSiteRule({ ...rule, enabled: checked });
        })
      );
      const deleteBtn = el("button", { className: "btn danger", type: "button" }, ["Delete"]) as HTMLButtonElement;
      deleteBtn.addEventListener("click", () =>
        void updateSiteRules(async () => {
          await removeSiteRule(rule.hostname);
        })
      );
      tbody.append(
        el("tr", {}, [
          el("td", {}, [rule.hostname]),
          el("td", {}, [speedInput]),
          el("td", {}, [enabledToggle]),
          el("td", {}, [el("div", { className: "rule-actions" }, [deleteBtn])]),
        ])
      );
    }
    table.append(tbody);
    section.append(table);
  }

  const form = el("form", { className: "add-chip-form" }) as HTMLFormElement;
  const hostInput = el("input", { type: "text", placeholder: "example.com" }) as HTMLInputElement;
  const speedInput = el("input", { type: "number", min: "0.05", max: "16", step: "0.05", placeholder: "1.5", style: "min-width:70px" }) as HTMLInputElement;
  const addBtn = el("button", { type: "submit", className: "btn" }, ["Add site"]) as HTMLButtonElement;
  form.append(hostInput, speedInput, addBtn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const hostname = hostInput.value.trim().toLowerCase();
    if (!isValidHostname(hostname)) return;
    const speed = clampSpeed(parseFloat(speedInput.value), 1);
    void updateSiteRules(async () => {
      await upsertSiteRule({ hostname, enabled: true, speed });
    });
    hostInput.value = "";
    speedInput.value = "";
  });
  section.append(form);

  if (siteRules.length > 0) {
    const clearBtn = el("button", { className: "btn danger", type: "button", style: "margin-top:12px" }, ["Clear all site rules"]) as HTMLButtonElement;
    clearBtn.addEventListener("click", () => {
      if (!confirm("Remove every saved site rule? This can't be undone.")) return;
      void updateSiteRules(async () => {
        await clearSiteRules();
      });
    });
    section.append(clearBtn);
  }

  return section;
}

async function updateSiteRules(mutate: () => Promise<void>): Promise<void> {
  await mutate();
  siteRules = await getSiteRules();
  showToast("Saved");
  renderAll();
}

// ---------- Future features ----------
function renderFutureSection(): HTMLElement {
  const section = el("section", { className: "card" }, [
    el("h2", {}, ["Coming later"]),
    el("p", { className: "card-desc" }, ["Deliberately not in this release, so the rest of SpeedPilot could be solid instead of spread thin."]),
    el(
      "div",
      { className: "future-list" },
      FUTURE_FEATURES.map((f) => el("div", { className: "future-item" }, [el("strong", {}, [f.name]), el("p", {}, [f.description])]))
    ),
  ]);
  return section;
}

// ---------- shared field builders ----------
function fieldToggle(label: string, description: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement {
  return el("div", { className: "field-row" }, [
    el("div", { className: "field-label" }, [el("strong", {}, [label]), el("span", {}, [description])]),
    buildToggle(checked, onChange),
  ]);
}

function fieldAction(label: string, description: string, buttonLabel: string, onClick: () => void, disabled = false): HTMLElement {
  const button = el("button", { className: "btn", type: "button", disabled }, [buttonLabel]) as HTMLButtonElement;
  button.addEventListener("click", onClick);
  return el("div", { className: "field-row" }, [el("div", { className: "field-label" }, [el("strong", {}, [label]), el("span", {}, [description])]), button]);
}

function buildToggle(checked: boolean, onChange: (checked: boolean) => void): HTMLElement {
  const input = el("input", { type: "checkbox", checked }) as HTMLInputElement;
  input.addEventListener("change", () => onChange(input.checked));
  const track = el("span", { className: "track" });
  const label = el("label", { className: "switch" }, [input, track]);
  return label;
}

function fieldSelect(
  label: string,
  description: string,
  value: string,
  options: [string, string][],
  onChange: (value: string) => void
): HTMLElement {
  const select = el(
    "select",
    {},
    options.map(([v, text]) => {
      const opt = el("option", { value: v }, [text]) as HTMLOptionElement;
      if (v === value) opt.selected = true;
      return opt;
    })
  ) as HTMLSelectElement;
  select.addEventListener("change", () => onChange(select.value));
  return el("div", { className: "field-row" }, [el("div", { className: "field-label" }, [el("strong", {}, [label]), el("span", {}, [description])]), select]);
}

function fieldNumber(
  label: string,
  description: string,
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void
): HTMLElement {
  const input = el("input", { type: "number", value: String(value), min: String(min), max: String(max), step: String(step) }) as HTMLInputElement;
  input.addEventListener("change", () => onChange(parseFloat(input.value)));
  return el("div", { className: "field-row" }, [el("div", { className: "field-label" }, [el("strong", {}, [label]), el("span", {}, [description])]), input]);
}

void init();
