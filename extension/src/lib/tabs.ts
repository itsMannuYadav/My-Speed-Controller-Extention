/** Resolves the tab that popup/side-panel/options actions should act on. */
export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab ?? null;
  } catch {
    // chrome.tabs.query can reject in edge-case window states (e.g. no window
    // currently focused) — treat that the same as "no active tab found" rather
    // than letting it bubble up and leave a caller's message port hanging.
    return null;
  }
}

/** Sends a message to a tab's (top-frame) content script and resolves with its
 * response, or null if the tab has no content script listening (e.g. a
 * chrome:// page, the Web Store, or a page that hasn't finished loading yet). */
export async function sendToTab<T>(tabId: number, message: unknown): Promise<T | null> {
  try {
    const response = (await chrome.tabs.sendMessage(tabId, message)) as T | undefined;
    return response ?? null;
  } catch {
    return null;
  }
}
