import { MAX_SPEED, MIN_SPEED } from "./constants";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Clamps a candidate playback speed into the supported range, rejecting
 * NaN/Infinity/negative/non-numeric input by falling back to `fallback`. */
export function clampSpeed(value: unknown, fallback = 1): number {
  if (!isFiniteNumber(value) || value <= 0) return fallback;
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
}

/** Rounds to a sane display/storage precision (avoids float drift like 1.2000000001). */
export function normalizeSpeed(value: number): number {
  return Math.round(value * 100) / 100;
}

export function clampStep(value: unknown, fallback = 0.25): number {
  if (!isFiniteNumber(value) || value <= 0) return fallback;
  return Math.min(5, Math.max(0.01, value));
}

/** Rewind/forward seconds: positive, finite, capped to something a UI can sanely show. */
export function clampSeconds(value: unknown, fallback = 10): number {
  if (!isFiniteNumber(value) || value <= 0) return fallback;
  return Math.min(600, Math.max(1, Math.round(value)));
}

export function isValidHostname(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length < 256 && !/\s/.test(value);
}

/** Cleans a presets list — deduping and clamping each value — while preserving
 * whatever order it was given in. Order is significant: it's what lets users
 * manually reorder their presets in Settings instead of always seeing them
 * forced back into ascending order. */
export function sanitizePresets(values: unknown, fallback: number[]): number[] {
  if (!Array.isArray(values)) return fallback;
  const cleaned = values
    .filter((v): v is number => isFiniteNumber(v) && v > 0)
    .map((v) => normalizeSpeed(clampSpeed(v)));
  const unique = Array.from(new Set(cleaned));
  return unique.length > 0 ? unique : fallback;
}

/** Clamps a pixel offset (e.g. the on-video controller's dragged position) to a
 * sane bound — rejects NaN/Infinity and caps how far off-scale a stored value
 * can be, without caring about screen size (that's enforced at render time). */
export function clampOffset(value: unknown, fallback = 0): number {
  if (!isFiniteNumber(value)) return fallback;
  return Math.min(4000, Math.max(-4000, Math.round(value)));
}
