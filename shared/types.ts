/**
 * Shared type definitions used by both the SpeedPilot website (marketing demo) and
 * the browser extension (real implementation). Keeping these in one place means the
 * website's interactive demo and the extension's storage model can never drift apart.
 */

export type ThemePreference = "system" | "light" | "dark";

export type OverlayMode = "always" | "hover" | "autohide" | "disabled";

export type MediaKind = "video" | "audio";

export type MediaSelectionMode = "current" | "all";

/** Keys the in-page keyboard handler understands. Values are single-key strings
 * (e.g. "a", "d", "s") compared case-insensitively; modifier combos are out of scope
 * because most defaults are bare letters that must still avoid input fields. */
export type ShortcutAction =
  | "increase"
  | "decrease"
  | "reset"
  | "rewind"
  | "forward"
  | "toggleController";

export interface ShortcutBinding {
  key: string;
  enabled: boolean;
}

export type ShortcutMap = Record<ShortcutAction, ShortcutBinding>;

export interface UserSettings {
  /** Global default playback rate applied when no site rule matches. */
  defaultSpeed: number;
  /** Amount +/- buttons and the increase/decrease shortcuts change speed by. */
  speedStep: number;
  /** Quick-access speed presets, in display order. */
  presets: number[];
  /** Whether visiting a site with a saved rule auto-applies that rule's speed. */
  rememberSiteSpeed: boolean;
  /** Whether the floating on-video controller renders at all. */
  showOverlay: boolean;
  overlayMode: OverlayMode;
  theme: ThemePreference;
  rewindSeconds: number;
  forwardSeconds: number;
  /** "Keep my selected speed" — reassert rate if the host page changes it. */
  lockSpeed: boolean;
  /** Default target when changing speed: just the active video, or every media
   * element detected on the page. */
  defaultSelectionMode: MediaSelectionMode;
  /** Opt-in only. When false (default), settings stay in chrome.storage.local. */
  syncEnabled: boolean;
  shortcuts: ShortcutMap;
  /** User-dragged offset (px) of the on-video controller from its default
   * top-right anchor. {0,0} until the user repositions it; persists globally
   * across sites once they do. */
  overlayOffsetX: number;
  overlayOffsetY: number;
}

export interface SiteRule {
  hostname: string;
  enabled: boolean;
  speed: number;
}

export interface AppStorage {
  settings: UserSettings;
  siteRules: SiteRule[];
}

/** One entry in the content script's live media registry, mirrored to the
 * popup/side panel over messaging. Not the DOM element itself — a serializable
 * snapshot of its state. */
export interface MediaSnapshot {
  id: string;
  kind: MediaKind;
  playbackRate: number;
  currentTime: number;
  duration: number;
  isLive: boolean;
  paused: boolean;
  muted: boolean;
  volume: number;
  readyState: number;
  supportsPiP: boolean;
  isPictureInPicture: boolean;
  /** False once a requested rate change didn't actually take (some players clamp
   * or reject playbackRate assignment) — lets the UI say so instead of just
   * silently disagreeing with what the user asked for. */
  speedControlAvailable: boolean;
}

export interface PageMediaState {
  hostname: string;
  media: MediaSnapshot[];
  activeMediaId: string | null;
  siteRule: SiteRule | null;
}

/** Messages sent from popup/side panel/options to the content script (via the
 * background service worker relay), and content script → popup updates. */
export type RuntimeMessage =
  | { type: "GET_PAGE_STATE" }
  | { type: "PAGE_STATE"; payload: PageMediaState }
  | { type: "SET_SPEED"; payload: { speed: number; target: MediaSelectionMode; mediaId?: string } }
  | { type: "STEP_SPEED"; payload: { direction: "increase" | "decrease" } }
  | { type: "RESET_SPEED" }
  | { type: "SEEK"; payload: { direction: "rewind" | "forward" } }
  | { type: "SELECT_MEDIA"; payload: { mediaId: string } }
  | { type: "REQUEST_PIP"; payload: { mediaId: string } }
  | { type: "TOGGLE_FOCUS_MODE" }
  | { type: "TOGGLE_OVERLAY" }
  | { type: "SET_SITE_RULE"; payload: { speed: number; enabled: boolean } }
  | { type: "CLEAR_SITE_RULE" }
  | { type: "SETTINGS_UPDATED"; payload: UserSettings };
