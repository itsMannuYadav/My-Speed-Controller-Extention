import type { RuntimeMessage } from "@speedpilot/shared";

/** Sends a RuntimeMessage to the background relay and resolves with its response.
 * Resolves to null (never throws) when there's nothing to talk to — e.g. a
 * chrome:// page, the Web Store, or a tab whose content script hasn't loaded yet —
 * so callers can render a clear empty/error state instead of an unhandled rejection. */
export async function sendMessage<T>(message: RuntimeMessage): Promise<T | null> {
  try {
    const response = (await chrome.runtime.sendMessage(message)) as T | undefined;
    return response ?? null;
  } catch {
    return null;
  }
}
