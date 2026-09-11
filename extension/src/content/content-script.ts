import type { PageMediaState, RuntimeMessage } from "@speedpilot/shared";
import { getSettings, getSiteRuleFor, onStorageChange, saveSettings } from "../lib/storage";
import { MediaRegistry } from "./media-registry";
import { MediaDetector } from "./media-detector";
import { SpeedManager } from "./speed-manager";
import { OverlayController } from "./overlay-controller";
import { FocusModeController } from "./focus-mode";
import { attachKeyboardHandler } from "./keyboard-handler";
import { PageToast } from "./page-toast";

/**
 * Content-script entry point. Wires MediaDetector → MediaRegistry →
 * SpeedManager → (OverlayController / FocusModeController), and is the only place
 * that talks to the background service worker (via chrome.runtime.onMessage) and to
 * chrome.storage directly (settings + site rules), per the architecture in the plan.
 */
async function main(): Promise<void> {
  const hostname = location.hostname;
  let settings = await getSettings();
  let siteRule = await getSiteRuleFor(hostname);

  const registry = new MediaRegistry();
  const detector = new MediaDetector(registry);
  const speedManager = new SpeedManager(registry, settings, siteRule);
  const focusMode = new FocusModeController();
  const toast = new PageToast();
  const overlay = new OverlayController({
    onStep: (direction) => speedManager.stepSpeed(direction),
    onRepositionEnd: (offsetX, offsetY) => {
      settings = { ...settings, overlayOffsetX: offsetX, overlayOffsetY: offsetY };
      void saveSettings(settings);
    },
  });
  overlay.setEnabled(settings.showOverlay, settings.overlayMode);
  overlay.setOffset(settings.overlayOffsetX, settings.overlayOffsetY);

  function syncOverlay(): void {
    const controller = speedManager.activeController();
    overlay.attachTo(controller?.mediaElement ?? null);
  }

  function toggleOverlaySetting(): void {
    settings = { ...settings, showOverlay: !settings.showOverlay };
    overlay.setEnabled(settings.showOverlay, settings.overlayMode);
    toast.show(settings.showOverlay ? "Controller shown" : "Controller hidden");
  }

  registry.onChange(syncOverlay);
  // 'play' doesn't bubble, but a capturing listener on document still sees it
  // fire on any descendant during the capture phase — no per-element wiring needed.
  document.addEventListener("play", syncOverlay, true);

  detector.start();
  syncOverlay();

  attachKeyboardHandler(() => settings, {
    increase: () => speedManager.stepSpeed("increase"),
    decrease: () => speedManager.stepSpeed("decrease"),
    reset: () => speedManager.resetSpeed(),
    rewind: () => speedManager.seek("rewind"),
    forward: () => speedManager.seek("forward"),
    toggleController: toggleOverlaySetting,
  });

  onStorageChange(({ settings: newSettings, siteRules }) => {
    settings = newSettings;
    siteRule = siteRules.find((r) => r.hostname === hostname && r.enabled) ?? null;
    speedManager.updateSettings(settings);
    speedManager.updateSiteRule(siteRule);
    overlay.setEnabled(settings.showOverlay, settings.overlayMode);
    overlay.setOffset(settings.overlayOffsetX, settings.overlayOffsetY);
  });

  function buildPageState(): PageMediaState {
    return {
      hostname,
      media: speedManager.list().map((c) => c.snapshot()),
      activeMediaId: speedManager.activeMediaId(),
      siteRule,
    };
  }

  chrome.runtime.onMessage.addListener((message: RuntimeMessage, _sender, sendResponse) => {
    void (async () => {
      switch (message.type) {
        case "GET_PAGE_STATE":
          sendResponse(buildPageState());
          break;
        case "SET_SPEED":
          speedManager.setSpeed(message.payload.speed, message.payload.target, message.payload.mediaId);
          sendResponse(buildPageState());
          break;
        case "STEP_SPEED":
          speedManager.stepSpeed(message.payload.direction);
          sendResponse(buildPageState());
          break;
        case "RESET_SPEED":
          speedManager.resetSpeed();
          sendResponse(buildPageState());
          break;
        case "SEEK":
          speedManager.seek(message.payload.direction);
          sendResponse(buildPageState());
          break;
        case "SELECT_MEDIA":
          speedManager.selectMedia(message.payload.mediaId);
          syncOverlay();
          sendResponse(buildPageState());
          break;
        case "REQUEST_PIP":
          await speedManager.requestPiP(message.payload.mediaId);
          sendResponse(buildPageState());
          break;
        case "TOGGLE_FOCUS_MODE": {
          const id = speedManager.toggleFocusMode();
          focusMode.sync(id ? (speedManager.get(id)?.mediaElement ?? null) : null);
          sendResponse(buildPageState());
          break;
        }
        case "TOGGLE_OVERLAY":
          toggleOverlaySetting();
          sendResponse(buildPageState());
          break;
        default:
          sendResponse(null);
      }
    })();
    return true; // async sendResponse above
  });
}

void main();
