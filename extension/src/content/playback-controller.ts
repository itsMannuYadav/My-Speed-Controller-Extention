import { clampSpeed, isLiveMedia, normalizeSpeed, type MediaKind, type MediaSnapshot } from "@speedpilot/shared";

/** Wraps a single `<video>`/`<audio>` element. Every mutation goes through here so
 * validation/clamping happens in exactly one place before a value ever touches the
 * live element. */
export class PlaybackController {
  /** Flips false the first time a requested rate visibly doesn't take. A handful
   * of exotic/DRM-guarded players silently ignore or immediately revert
   * playbackRate assignment — this is how the UI finds out and says so, instead
   * of just quietly disagreeing with what the user asked for. */
  private rateChangeReliable = true;

  constructor(
    private element: HTMLMediaElement,
    private id: string
  ) {}

  get mediaElement(): HTMLMediaElement {
    return this.element;
  }

  kind(): MediaKind {
    return this.element.tagName.toLowerCase() === "audio" ? "audio" : "video";
  }

  setRate(rate: number): number {
    const clean = normalizeSpeed(clampSpeed(rate, this.element.playbackRate || 1));
    // Some players clamp/reset playbackRate themselves; reading it back after
    // assignment reflects whatever the browser/player actually accepted.
    try {
      this.element.playbackRate = clean;
      this.rateChangeReliable = Math.abs(this.element.playbackRate - clean) < 0.02;
    } catch {
      // A handful of exotic players throw on assignment; leave rate unchanged.
      this.rateChangeReliable = false;
    }
    return this.element.playbackRate;
  }

  seek(deltaSeconds: number): void {
    if (isLiveMedia(this.element.duration)) return; // seeking a live stream isn't meaningful
    const duration = Number.isFinite(this.element.duration) ? this.element.duration : Infinity;
    const next = Math.min(Math.max(0, this.element.currentTime + deltaSeconds), duration);
    try {
      this.element.currentTime = next;
    } catch {
      // Some cross-origin/DRM-guarded elements reject seeks — fail silently, no crash.
    }
  }

  supportsPiP(): boolean {
    return (
      this.kind() === "video" &&
      typeof document.pictureInPictureEnabled === "boolean" &&
      document.pictureInPictureEnabled &&
      !(this.element as HTMLVideoElement).disablePictureInPicture
    );
  }

  isPictureInPicture(): boolean {
    return document.pictureInPictureElement === this.element;
  }

  async requestPiP(): Promise<boolean> {
    if (!this.supportsPiP()) return false;
    try {
      if (this.isPictureInPicture()) {
        await document.exitPictureInPicture();
      } else {
        await (this.element as HTMLVideoElement).requestPictureInPicture();
      }
      return true;
    } catch {
      return false;
    }
  }

  snapshot(): MediaSnapshot {
    const el = this.element;
    return {
      id: this.id,
      kind: this.kind(),
      playbackRate: el.playbackRate,
      currentTime: el.currentTime,
      duration: el.duration,
      isLive: isLiveMedia(el.duration),
      paused: el.paused,
      muted: el.muted,
      volume: el.volume,
      readyState: el.readyState,
      supportsPiP: this.supportsPiP(),
      isPictureInPicture: this.isPictureInPicture(),
      speedControlAvailable: this.rateChangeReliable,
    };
  }
}
