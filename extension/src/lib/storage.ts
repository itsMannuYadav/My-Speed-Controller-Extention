import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type AppStorage,
  type SiteRule,
  type UserSettings,
} from "@speedpilot/shared";
import { clampOffset, clampSeconds, clampSpeed, clampStep, isValidHostname, sanitizePresets } from "@speedpilot/shared";

/**
 * Typed wrapper around chrome.storage. `chrome.storage.local` is always the source of
 * truth and the only thing ever read. When the user opts into `syncEnabled`, writes are
 * *also* mirrored (best-effort) to chrome.storage.sync as a cross-device backup — sync
 * is never read from automatically, so there's no silent merge behavior to reason about.
 * Nothing here ever touches browsing history, URLs, or media content — only the
 * settings/site-rule shapes defined in shared/types.ts.
 */

function sanitizeSettings(raw: unknown): UserSettings {
  const base = DEFAULT_SETTINGS;
  if (!raw || typeof raw !== "object") return base;
  const s = raw as Partial<UserSettings>;
  return {
    defaultSpeed: clampSpeed(s.defaultSpeed, base.defaultSpeed),
    speedStep: clampStep(s.speedStep, base.speedStep),
    presets: sanitizePresets(s.presets, base.presets),
    rememberSiteSpeed: typeof s.rememberSiteSpeed === "boolean" ? s.rememberSiteSpeed : base.rememberSiteSpeed,
    showOverlay: typeof s.showOverlay === "boolean" ? s.showOverlay : base.showOverlay,
    overlayMode: (["always", "hover", "autohide", "disabled"] as const).includes(s.overlayMode as never)
      ? (s.overlayMode as UserSettings["overlayMode"])
      : base.overlayMode,
    theme: (["system", "light", "dark"] as const).includes(s.theme as never)
      ? (s.theme as UserSettings["theme"])
      : base.theme,
    rewindSeconds: clampSeconds(s.rewindSeconds, base.rewindSeconds),
    forwardSeconds: clampSeconds(s.forwardSeconds, base.forwardSeconds),
    lockSpeed: typeof s.lockSpeed === "boolean" ? s.lockSpeed : base.lockSpeed,
    defaultSelectionMode: s.defaultSelectionMode === "all" ? "all" : "current",
    syncEnabled: typeof s.syncEnabled === "boolean" ? s.syncEnabled : base.syncEnabled,
    shortcuts: sanitizeShortcuts(s.shortcuts),
    overlayOffsetX: clampOffset(s.overlayOffsetX, base.overlayOffsetX),
    overlayOffsetY: clampOffset(s.overlayOffsetY, base.overlayOffsetY),
  };
}

function sanitizeShortcuts(raw: unknown): UserSettings["shortcuts"] {
  const base = DEFAULT_SETTINGS.shortcuts;
  if (!raw || typeof raw !== "object") return base;
  const s = raw as Partial<UserSettings["shortcuts"]>;
  const out = { ...base };
  for (const action of Object.keys(base) as (keyof typeof base)[]) {
    const binding = s[action];
    if (binding && typeof binding.key === "string" && binding.key.length > 0) {
      out[action] = { key: binding.key.slice(0, 1).toLowerCase(), enabled: binding.enabled !== false };
    }
  }
  return out;
}

function sanitizeSiteRules(raw: unknown): SiteRule[] {
  if (!Array.isArray(raw)) return [];
  const out: SiteRule[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Partial<SiteRule>;
    if (!isValidHostname(r.hostname)) continue;
    out.push({
      hostname: r.hostname.toLowerCase(),
      enabled: r.enabled !== false,
      speed: clampSpeed(r.speed, 1),
    });
  }
  return out;
}

export async function getSettings(): Promise<UserSettings> {
  const stored = await chrome.storage.local.get(STORAGE_KEYS.settings);
  return sanitizeSettings(stored[STORAGE_KEYS.settings]);
}

export async function saveSettings(next: UserSettings): Promise<UserSettings> {
  const clean = sanitizeSettings(next);
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: clean });
  if (clean.syncEnabled) {
    void chrome.storage.sync.set({ [STORAGE_KEYS.settings]: clean }).catch(() => void 0);
  }
  return clean;
}

export async function getSiteRules(): Promise<SiteRule[]> {
  const stored = await chrome.storage.local.get(STORAGE_KEYS.siteRules);
  return sanitizeSiteRules(stored[STORAGE_KEYS.siteRules]);
}

async function persistSiteRules(rules: SiteRule[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.siteRules]: rules });
  const settings = await getSettings();
  if (settings.syncEnabled) {
    void chrome.storage.sync.set({ [STORAGE_KEYS.siteRules]: rules }).catch(() => void 0);
  }
}

export async function upsertSiteRule(rule: SiteRule): Promise<SiteRule[]> {
  const rules = await getSiteRules();
  const hostname = rule.hostname.toLowerCase();
  const next = rules.filter((r) => r.hostname !== hostname);
  next.push({ ...rule, hostname, speed: clampSpeed(rule.speed, 1) });
  next.sort((a, b) => a.hostname.localeCompare(b.hostname));
  await persistSiteRules(next);
  return next;
}

export async function removeSiteRule(hostname: string): Promise<SiteRule[]> {
  const rules = await getSiteRules();
  const next = rules.filter((r) => r.hostname !== hostname.toLowerCase());
  await persistSiteRules(next);
  return next;
}

export async function clearSiteRules(): Promise<void> {
  await persistSiteRules([]);
}

export async function getSiteRuleFor(hostname: string): Promise<SiteRule | null> {
  const rules = await getSiteRules();
  return rules.find((r) => r.hostname === hostname.toLowerCase() && r.enabled) ?? null;
}

export async function getAppStorage(): Promise<AppStorage> {
  const [settings, siteRules] = await Promise.all([getSettings(), getSiteRules()]);
  return { settings, siteRules };
}

/** Subscribes to chrome.storage.local changes affecting settings/site rules.
 * Returns an unsubscribe function — always call it on teardown to avoid leaks. */
export function onStorageChange(callback: (storage: AppStorage) => void): () => void {
  const listener: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, area) => {
    if (area !== "local") return;
    if (!(STORAGE_KEYS.settings in changes) && !(STORAGE_KEYS.siteRules in changes)) return;
    void getAppStorage().then(callback);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
