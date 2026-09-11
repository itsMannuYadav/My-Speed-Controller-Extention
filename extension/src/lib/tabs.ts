/** Resolves the tab that popup/side-panel/options actions should act on. */
export async function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
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
