export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "speedpilot.theme";

/** Executed inline, before paint, so the page never flashes the wrong theme.
 * Kept as a plain string (not imported code) because it runs via
 * dangerouslySetInnerHTML in the document head, ahead of any bundle. */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage can throw in locked-down contexts (private browsing, etc.)
  }
  return "system";
}

export function setTheme(theme: ThemePreference): void {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  try {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Best-effort persistence only.
  }
}
