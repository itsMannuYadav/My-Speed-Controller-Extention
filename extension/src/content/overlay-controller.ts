import type { OverlayMode } from "@speedpilot/shared";

export interface OverlayCallbacks {
  onStep: (direction: "increase" | "decrease") => void;
  /** Fired once, when the user finishes dragging the controller to a new spot —
   * not on every pointermove — so callers can persist it without spamming storage. */
  onRepositionEnd?: (offsetX: number, offsetY: number) => void;
}

const OVERLAY_STYLES = `
  :host { all: initial; }
  .pill {
    position: fixed;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    background: rgba(17, 17, 24, 0.86);
    color: #fff;
    border-radius: 999px;
    font: 600 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 140ms ease, transform 140ms ease;
    pointer-events: none;
    z-index: 2147483647;
    user-select: none;
    cursor: grab;
    touch-action: none;
  }
  .pill.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
  .pill.dragging { cursor: grabbing; transition: none; }
  button {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
  }
  button:hover, button:focus-visible { background: rgba(255,255,255,0.18); }
  .value { min-width: 44px; text-align: center; letter-spacing: 0.2px; }
`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** The small floating "− 1.50× +" controller shown over the active video (planning
 * doc §"On-Video Controller"). Renders in a shadow root so host-page CSS can never
 * leak in or be broken by it. Position/visibility are driven only while attached to
 * a live element — no background polling when nothing is playing. Draggable: the
 * pill body repositions it (a persisted offset from its default corner), while the
 * −/+ buttons keep working normally since a drag never starts from a button. */
export class OverlayController {
  private host = document.createElement("div");
  private shadow: ShadowRoot;
  private pill: HTMLDivElement;
  private valueEl: HTMLSpanElement;
  private target: HTMLMediaElement | null = null;
  private mode: OverlayMode = "hover";
  private enabled = true;
  private rafId: number | null = null;
  private hideTimer: number | null = null;
  private mounted = false;

  private offsetX = 0;
  private offsetY = 0;
  private dragging = false;
  private pointerOverPill = false;
  private hideDelayTimer: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartOffsetX = 0;
  private dragStartOffsetY = 0;

  constructor(private callbacks: OverlayCallbacks) {
    this.shadow = this.host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = OVERLAY_STYLES;
    this.pill = document.createElement("div");
    this.pill.className = "pill";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease playback speed");
    minus.addEventListener("click", () => this.callbacks.onStep("decrease"));

    this.valueEl = document.createElement("span");
    this.valueEl.className = "value";
    this.valueEl.textContent = "1.00×";

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase playback speed");
    plus.addEventListener("click", () => this.callbacks.onStep("increase"));

    this.pill.append(minus, this.valueEl, plus);
    this.shadow.append(style, this.pill);

    this.pill.addEventListener("pointerdown", this.onPointerDown);
    this.pill.addEventListener("pointermove", this.onPointerMove);
    this.pill.addEventListener("pointerup", this.onPointerUp);
    this.pill.addEventListener("pointercancel", this.onPointerUp);

    // The pill is a separate fixed-position element that visually overlaps the
    // video it's anchored to — without this bridge, moving the cursor off the
    // video and onto the pill (to click a button, or start a drag) would hit-test
    // as leaving the video and hide the pill out from under the cursor.
    this.pill.addEventListener("mouseenter", () => {
      this.pointerOverPill = true;
      this.cancelScheduledHide();
    });
    this.pill.addEventListener("mouseleave", () => {
      this.pointerOverPill = false;
      if (this.mode === "hover") this.scheduleHide();
    });
  }

  setEnabled(enabled: boolean, mode: OverlayMode): void {
    this.enabled = enabled;
    this.mode = mode;
    if (!enabled) this.detach();
  }

  /** Sets the persisted drag offset — call once, from storage, before the
   * controller is first shown (e.g. on load or after a settings change). */
  setOffset(offsetX: number, offsetY: number): void {
    if (this.dragging) return; // never fight the user's own live drag
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  updateRate(rate: number): void {
    this.valueEl.textContent = `${rate.toFixed(2)}×`;
  }

  attachTo(target: HTMLMediaElement | null): void {
    if (target === this.target) return;
    this.detachListeners();
    this.target = target;
    if (!target || !this.enabled) {
      this.hide();
      return;
    }
    this.mountIfNeeded();
    this.updateRate(target.playbackRate);
    this.wireTargetEvents(target);
    if (this.mode === "always") this.show();
  }

  private mountIfNeeded(): void {
    if (this.mounted) return;
    document.documentElement.appendChild(this.host);
    this.mounted = true;
  }

  private onRateChange = () => {
    if (this.target) this.updateRate(this.target.playbackRate);
  };
  private onEnter = () => {
    this.cancelScheduledHide();
    if (this.mode === "hover" || this.mode === "autohide") this.show();
  };
  private onLeave = () => {
    if (this.dragging || this.pointerOverPill) return; // don't hide mid-drag or while the cursor is on the pill itself
    if (this.mode === "hover") this.scheduleHide();
    if (this.mode === "autohide") this.scheduleAutoHide();
  };
  private onInteract = () => {
    if (this.mode === "autohide") {
      this.show();
      this.scheduleAutoHide();
    }
  };

  private onPointerDown = (event: PointerEvent): void => {
    if ((event.target as HTMLElement).closest("button")) return; // let the −/+ buttons work normally
    event.preventDefault();
    this.dragging = true;
    this.pill.classList.add("dragging");
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragStartOffsetX = this.offsetX;
    this.dragStartOffsetY = this.offsetY;
    this.pill.setPointerCapture(event.pointerId);
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragging) return;
    this.offsetX = this.dragStartOffsetX + (event.clientX - this.dragStartX);
    this.offsetY = this.dragStartOffsetY + (event.clientY - this.dragStartY);
    // The rAF position loop (already running while visible) picks this up next
    // frame — no need to force an extra layout pass from a pointer-rate handler.
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (!this.dragging) return;
    this.dragging = false;
    this.pill.classList.remove("dragging");
    if (this.pill.hasPointerCapture(event.pointerId)) this.pill.releasePointerCapture(event.pointerId);
    this.callbacks.onRepositionEnd?.(this.offsetX, this.offsetY);
  };

  private wireTargetEvents(target: HTMLMediaElement): void {
    target.addEventListener("ratechange", this.onRateChange);
    target.addEventListener("mouseenter", this.onEnter);
    target.addEventListener("mouseleave", this.onLeave);
    target.addEventListener("play", this.onInteract);
    target.addEventListener("seeked", this.onInteract);
  }

  private detachListeners(): void {
    if (!this.target) return;
    this.target.removeEventListener("ratechange", this.onRateChange);
    this.target.removeEventListener("mouseenter", this.onEnter);
    this.target.removeEventListener("mouseleave", this.onLeave);
    this.target.removeEventListener("play", this.onInteract);
    this.target.removeEventListener("seeked", this.onInteract);
  }

  private scheduleAutoHide(): void {
    if (this.hideTimer !== null) window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => {
      if (!this.dragging && !this.pointerOverPill) this.hide();
    }, 2200);
  }

  /** Delays hiding briefly so moving the cursor from the video onto the
   * overlapping pill (to click a button or start a drag) doesn't hide it first. */
  private scheduleHide(): void {
    this.cancelScheduledHide();
    this.hideDelayTimer = window.setTimeout(() => {
      if (!this.dragging && !this.pointerOverPill) this.hide();
    }, 200);
  }

  private cancelScheduledHide(): void {
    if (this.hideDelayTimer !== null) {
      window.clearTimeout(this.hideDelayTimer);
      this.hideDelayTimer = null;
    }
  }

  private show(): void {
    this.cancelScheduledHide();
    this.pill.classList.add("visible");
    if (this.rafId === null) this.positionLoop();
  }

  private hide(): void {
    this.pill.classList.remove("visible");
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private detach(): void {
    this.detachListeners();
    this.cancelScheduledHide();
    this.target = null;
    this.hide();
  }

  private positionLoop = (): void => {
    if (!this.target || !this.pill.classList.contains("visible")) {
      this.rafId = null;
      return;
    }
    if (!this.target.isConnected) {
      this.hide();
      return;
    }
    const rect = this.target.getBoundingClientRect();
    const left = clamp(rect.right - 130 + this.offsetX, 8, Math.max(8, window.innerWidth - 60));
    const top = clamp(rect.top + 10 + this.offsetY, 8, Math.max(8, window.innerHeight - 34));
    this.pill.style.left = `${left}px`;
    this.pill.style.top = `${top}px`;
    this.rafId = requestAnimationFrame(this.positionLoop);
  };
}
