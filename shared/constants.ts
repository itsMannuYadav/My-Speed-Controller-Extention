import type { ShortcutMap, UserSettings } from "./types";

export const BRAND_NAME = "SpeedPilot";
export const BRAND_TAGLINE = "Control playback. Your way.";

/** Hard bounds. Every speed value that reaches storage or a media element is
 * clamped/validated against these — see validate.ts. */
export const MIN_SPEED = 0.05;
export const MAX_SPEED = 16;

export const DEFAULT_PRESETS: number[] = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 8, 16];

export const DEFAULT_SHORTCUTS: ShortcutMap = {
  increase: { key: "d", enabled: true },
  decrease: { key: "a", enabled: true },
  reset: { key: "s", enabled: true },
  rewind: { key: "z", enabled: true },
  forward: { key: "x", enabled: true },
  toggleController: { key: "v", enabled: true },
};

export const DEFAULT_SETTINGS: UserSettings = {
  defaultSpeed: 1,
  speedStep: 0.25,
  presets: DEFAULT_PRESETS,
  rememberSiteSpeed: true,
  showOverlay: true,
  overlayMode: "hover",
  theme: "system",
  rewindSeconds: 10,
  forwardSeconds: 10,
  lockSpeed: false,
  defaultSelectionMode: "current",
  syncEnabled: false,
  shortcuts: DEFAULT_SHORTCUTS,
  overlayOffsetX: 0,
  overlayOffsetY: 0,
};

export const STORAGE_KEYS = {
  settings: "speedpilot.settings",
  siteRules: "speedpilot.siteRules",
} as const;

/** Features described in the original spec that are intentionally not in v1.
 * Surfaced verbatim in the options page and README so nothing is silently missing. */
export const FUTURE_FEATURES = [
  {
    name: "Speed Profiles",
    description: "Switch between named bundles of speed + rewind/forward settings (e.g. Study, Quick Review).",
  },
  {
    name: "Hold-to-Boost",
    description: "Hold a shortcut to temporarily jump to a boosted speed, releasing to return to the previous rate.",
  },
  {
    name: "Skip Silence",
    description: "Automatically skip quiet passages. Deferred until it can be done reliably without heavy audio analysis.",
  },
] as const;
