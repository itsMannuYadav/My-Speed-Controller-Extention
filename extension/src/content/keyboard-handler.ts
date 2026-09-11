import type { ShortcutAction, UserSettings } from "@speedpilot/shared";

export type ShortcutActions = Record<ShortcutAction, () => void>;

const TYPING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** True when the user is actively typing somewhere on the page — shortcuts must
 * never hijack keystrokes meant for a search box, comment field, editor, etc. */
function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  if (TYPING_TAGS.has(el.tagName)) return true;
  if (el.isContentEditable) return true;
  const role = el.getAttribute?.("role");
  if (role === "textbox" || role === "searchbox" || role === "combobox") return true;
  return Boolean(el.closest?.('[contenteditable="true"]'));
}

/** Attaches the configurable in-page keyboard shortcuts (A/D/S/Z/X/V by default).
 * Returns a cleanup function that removes the listener — always call it on
 * teardown. Bare-letter shortcuts only; any key event carrying a modifier is
 * ignored so the extension never steals a site's own Ctrl/Alt/Meta shortcuts. */
export function attachKeyboardHandler(getSettings: () => UserSettings, actions: ShortcutActions): () => void {
  const listener = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (isTypingTarget(event.target)) return;

    const settings = getSettings();
    const key = event.key.toLowerCase();

    for (const [action, binding] of Object.entries(settings.shortcuts) as [ShortcutAction, { key: string; enabled: boolean }][]) {
      if (!binding.enabled) continue;
      if (binding.key.toLowerCase() !== key) continue;
      event.preventDefault();
      actions[action]();
      return;
    }
  };

  document.addEventListener("keydown", listener, true);
  return () => document.removeEventListener("keydown", listener, true);
}
