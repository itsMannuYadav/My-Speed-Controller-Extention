import { test } from "node:test";
import assert from "node:assert/strict";
import {
  remainingRealTime,
  estimateTimeSavedRemaining,
  estimateTimeSavedTotal,
  formatDuration,
  isLiveMedia,
} from "./time";

test("remainingRealTime divides by playback rate", () => {
  // 60 minutes total, 20 minutes watched, 1.5x -> 40min / 1.5 = ~26.67min remaining
  const result = remainingRealTime({ duration: 3600, currentTime: 1200, playbackRate: 1.5 });
  assert.equal(result, 1600); // (3600-1200)/1.5 = 1600s
});

test("remainingRealTime is null for live media", () => {
  assert.equal(remainingRealTime({ duration: Infinity, currentTime: 10, playbackRate: 1 }), null);
  assert.equal(remainingRealTime({ duration: NaN, currentTime: 10, playbackRate: 1 }), null);
});

test("remainingRealTime never goes negative when currentTime exceeds duration", () => {
  const result = remainingRealTime({ duration: 100, currentTime: 150, playbackRate: 2 });
  assert.equal(result, 0);
});

test("estimateTimeSavedRemaining only counts the unwatched portion", () => {
  // duration 60min, watched 20min already (at whatever speed that was), 40min left at 2x
  const saved = estimateTimeSavedRemaining({ duration: 3600, currentTime: 1200, playbackRate: 2 });
  assert.equal(saved, 1200); // remaining 2400s at 1x vs 1200s at 2x -> 1200s saved
});

test("estimateTimeSavedRemaining is negative for sub-1x speeds (time added)", () => {
  const saved = estimateTimeSavedRemaining({ duration: 100, currentTime: 0, playbackRate: 0.5 });
  assert.equal(saved, -100);
});

test("estimateTimeSavedTotal matches the spec example (60min at 1.5x saves 20min)", () => {
  const saved = estimateTimeSavedTotal(3600, 1.5);
  assert.equal(Math.round(saved / 60), 20);
});

test("formatDuration renders H:MM:SS above an hour and M:SS below", () => {
  assert.equal(formatDuration(3860), "1:04:20");
  assert.equal(formatDuration(90), "1:30");
  assert.equal(formatDuration(0), "0:00");
});

test("isLiveMedia detects non-finite or zero duration", () => {
  assert.equal(isLiveMedia(Infinity), true);
  assert.equal(isLiveMedia(NaN), true);
  assert.equal(isLiveMedia(0), true);
  assert.equal(isLiveMedia(120), false);
});
