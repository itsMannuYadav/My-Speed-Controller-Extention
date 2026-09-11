import type { MediaSelectionMode, SiteRule, UserSettings } from "@speedpilot/shared";
import { clampSpeed, normalizeSpeed } from "@speedpilot/shared";
import type { MediaRegistry } from "./media-registry";
import { PlaybackController } from "./playback-controller";

/**
 * Central orchestrator (the "SpeedManager" in the architecture doc): resolves the
 * effective speed from settings + site rule, applies it to one or all media
 * elements, tracks which element is "active" (most recently played, or explicitly
 * selected), and — when the user enables it — reasserts the chosen rate if the host
 * page changes it. Reconciliation with the registry happens lazily (on each public
 * call) rather than on a timer, so there's no continuous polling.
 */
export class SpeedManager {
  private controllers = new Map<string, PlaybackController>();
  private desiredRates = new Map<string, number>();
  private appliedInitial = new WeakSet<HTMLMediaElement>();
  private activeId: string | null = null;
  private settings: UserSettings;
  private siteRule: SiteRule | null;
  private focusModeMediaId: string | null = null;

  constructor(
    private registry: MediaRegistry,
    settings: UserSettings,
    siteRule: SiteRule | null
  ) {
    this.settings = settings;
    this.siteRule = siteRule;
    registry.onChange(() => this.sync());
  }

  updateSettings(settings: UserSettings): void {
    this.settings = settings;
  }

  updateSiteRule(rule: SiteRule | null): void {
    this.siteRule = rule;
  }

  private effectiveDefaultSpeed(): number {
    if (this.settings.rememberSiteSpeed && this.siteRule?.enabled) {
      return this.siteRule.speed;
    }
    return this.settings.defaultSpeed;
  }

  /** Reconciles tracked controllers against the live registry: wires listeners for
   * newly discovered elements, applies the default/site speed once per element, and
   * drops controllers for elements the registry has pruned. */
  private sync(): void {
    const live = this.registry.list();
    const liveIds = new Set<string>();

    for (const el of live) {
      const id = this.registry.idFor(el);
      if (!id) continue;
      liveIds.add(id);

      if (!this.controllers.has(id)) {
        const controller = new PlaybackController(el, id);
        this.controllers.set(id, controller);
        this.wireElement(el, id);
      }

      if (!this.appliedInitial.has(el)) {
        this.appliedInitial.add(el);
        const controller = this.controllers.get(id)!;
        const rate = controller.setRate(this.effectiveDefaultSpeed());
        this.desiredRates.set(id, rate);
      }
    }

    for (const id of Array.from(this.controllers.keys())) {
      if (!liveIds.has(id)) {
        this.controllers.delete(id);
        this.desiredRates.delete(id);
        if (this.activeId === id) this.activeId = null;
        if (this.focusModeMediaId === id) this.focusModeMediaId = null;
      }
    }

    if (!this.activeId || !this.controllers.has(this.activeId)) {
      const first = this.controllers.keys().next();
      this.activeId = first.done ? null : first.value;
    }
  }

  private wireElement(el: HTMLMediaElement, id: string): void {
    el.addEventListener("play", () => {
      this.activeId = id;
    });
    el.addEventListener("ratechange", () => {
      if (!this.settings.lockSpeed) return;
      const desired = this.desiredRates.get(id);
      if (desired === undefined) return;
      if (Math.abs(el.playbackRate - desired) > 0.001) {
        // The host page changed the rate out from under us — reassert once. This
        // triggers another 'ratechange' event where playbackRate === desired, so
        // the check above stops it there; it can never loop.
        this.controllers.get(id)?.setRate(desired);
      }
    });
  }

  refresh(): void {
    this.sync();
  }

  list(): PlaybackController[] {
    this.sync();
    return Array.from(this.controllers.values());
  }

  get(id: string): PlaybackController | undefined {
    this.sync();
    return this.controllers.get(id);
  }

  activeController(): PlaybackController | undefined {
    this.sync();
    return this.activeId ? this.controllers.get(this.activeId) : undefined;
  }

  activeMediaId(): string | null {
    this.sync();
    return this.activeId;
  }

  selectMedia(id: string): boolean {
    this.sync();
    if (!this.controllers.has(id)) return false;
    this.activeId = id;
    return true;
  }

  setSpeed(rate: number, target: MediaSelectionMode, mediaId?: string): number {
    this.sync();
    const clean = normalizeSpeed(clampSpeed(rate, this.effectiveDefaultSpeed()));
    if (target === "all") {
      for (const [id, controller] of this.controllers) {
        const applied = controller.setRate(clean);
        this.desiredRates.set(id, applied);
      }
      return clean;
    }
    const id = mediaId ?? this.activeId;
    const controller = id ? this.controllers.get(id) : undefined;
    if (!controller || !id) return clean;
    const applied = controller.setRate(clean);
    this.desiredRates.set(id, applied);
    return applied;
  }

  stepSpeed(direction: "increase" | "decrease"): number | null {
    this.sync();
    const controller = this.activeController();
    if (!controller) return null;
    const current = controller.snapshot().playbackRate;
    const delta = direction === "increase" ? this.settings.speedStep : -this.settings.speedStep;
    return this.setSpeed(current + delta, "current");
  }

  resetSpeed(): number | null {
    this.sync();
    if (!this.activeId) return null;
    return this.setSpeed(1, "current");
  }

  seek(direction: "rewind" | "forward"): void {
    this.sync();
    const controller = this.activeController();
    if (!controller) return;
    const seconds = direction === "rewind" ? -this.settings.rewindSeconds : this.settings.forwardSeconds;
    controller.seek(seconds);
  }

  async requestPiP(mediaId?: string): Promise<boolean> {
    this.sync();
    const id = mediaId ?? this.activeId;
    const controller = id ? this.controllers.get(id) : undefined;
    if (!controller) return false;
    return controller.requestPiP();
  }

  toggleFocusMode(mediaId?: string): string | null {
    this.sync();
    const id = mediaId ?? this.activeId;
    if (!id || !this.controllers.has(id)) return null;
    this.focusModeMediaId = this.focusModeMediaId === id ? null : id;
    return this.focusModeMediaId;
  }

  focusedMediaElement(): HTMLMediaElement | null {
    if (!this.focusModeMediaId) return null;
    return this.controllers.get(this.focusModeMediaId)?.mediaElement ?? null;
  }
}
