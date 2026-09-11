import type { RuntimeMessage } from "@speedpilot/shared";
import { getActiveTab, sendToTab } from "../lib/tabs";

/**
 * The background service worker is a thin relay: popup/side-panel/options pages
 * don't know which tab or content-script instance to talk to, so they send a
 * RuntimeMessage here and this worker forwards it to the active tab's content
 * script, then relays the content script's response straight back. It holds no
 * browsing history and does no polling — purely message-driven, MV3-idiomatic
 * (no persistent background page).
 */

const RELAYED_TYPES = new Set<RuntimeMessage["type"]>([
  "GET_PAGE_STATE",
  "SET_SPEED",
  "STEP_SPEED",
  "RESET_SPEED",
  "SEEK",
  "SELECT_MEDIA",
  "REQUEST_PIP",
  "TOGGLE_FOCUS_MODE",
  "TOGGLE_OVERLAY",
]);

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  // Ignore messages that originate *from* a content script (e.g. unsolicited
  // pushes) — this worker only relays requests made by extension UI surfaces.
  if (sender.tab) return undefined;
  if (!message || !RELAYED_TYPES.has(message.type)) return undefined;

  void (async () => {
    try {
      const tab = await getActiveTab();
      if (!tab?.id) {
        sendResponse(null);
        return;
      }
      const response = await sendToTab(tab.id, message);
      sendResponse(response);
    } catch (err) {
      // getActiveTab()/sendToTab() already guard their own failure modes, but
      // an uncaught rejection here would otherwise leave the message port open
      // forever — the caller's sendMessage() never resolves/rejects cleanly.
      console.error("[SpeedPilot] relay failed for", message.type, err);
      sendResponse(null);
    }
  })();

  return true; // keep the message channel open for the async sendResponse above
});

const COMMAND_TO_MESSAGE: Record<string, RuntimeMessage> = {
  "increase-speed": { type: "STEP_SPEED", payload: { direction: "increase" } },
  "decrease-speed": { type: "STEP_SPEED", payload: { direction: "decrease" } },
  "reset-speed": { type: "RESET_SPEED" },
  "toggle-controller": { type: "TOGGLE_OVERLAY" },
};

chrome.commands.onCommand.addListener((command) => {
  const message = COMMAND_TO_MESSAGE[command];
  if (!message) return;
  void (async () => {
    const tab = await getActiveTab();
    if (!tab?.id) return;
    await sendToTab(tab.id, message);
  })();
});

// The popup is the primary surface; the side panel is opt-in via its own button
// rather than replacing the toolbar click.
chrome.runtime.onInstalled.addListener(() => {
  void chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false }).catch(() => void 0);
});
