/**
 * "Smart Time Calculator" (planning doc §37) and "Time Saved" (§49).
 * Pure functions only — no DOM, no browser APIs — so they're usable from both the
 * extension (real media elements) and the website's interactive demo (simulated clock).
 */

export interface RemainingTimeInput {
  duration: number;
  currentTime: number;
  playbackRate: number;
}

/** True when a media element's duration can't be used for remaining-time math
 * (live streams report Infinity or NaN duration). */
export function isLiveMedia(duration: number): boolean {
  return !Number.isFinite(duration) || duration <= 0;
}

/** Seconds of real (wall-clock) time left to finish watching, at the given rate.
 * Returns null for live media, where "remaining time" is meaningless. */
export function remainingRealTime({ duration, currentTime, playbackRate }: RemainingTimeInput): number | null {
  if (isLiveMedia(duration)) return null;
  const rate = playbackRate > 0 ? playbackRate : 1;
  const remainingAtNormalSpeed = Math.max(0, duration - currentTime);
  return remainingAtNormalSpeed / rate;
}

/** Wall-clock seconds saved (positive) or added (negative) versus 1x playback,
 * counting only the *unwatched* remainder — never claims savings on time already
 * spent watching at whatever rate was active then. */
export function estimateTimeSavedRemaining({ duration, currentTime, playbackRate }: RemainingTimeInput): number {
  if (isLiveMedia(duration)) return 0;
  const rate = playbackRate > 0 ? playbackRate : 1;
  const remaining = Math.max(0, duration - currentTime);
  const atNormalSpeed = remaining;
  const atCurrentSpeed = remaining / rate;
  return atNormalSpeed - atCurrentSpeed;
}

/** Wall-clock seconds saved (or added) across an entire video's duration at a given
 * rate, relative to 1x. Used by the website demo, which has no "already watched"
 * portion to exclude. */
export function estimateTimeSavedTotal(duration: number, playbackRate: number): number {
  if (isLiveMedia(duration)) return 0;
  const rate = playbackRate > 0 ? playbackRate : 1;
  return duration - duration / rate;
}

/** Formats a non-negative, finite second count as H:MM:SS (or M:SS under an hour).
 * Callers are expected to check isLiveMedia()/null first and render "LIVE" themselves. */
export function formatDuration(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.round(totalSeconds) : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Compact "~24m" / "~1h 20m" style label for tight UI spaces (popup readouts). */
export function formatDurationCompact(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.round(totalSeconds) : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${safe}s`;
}
