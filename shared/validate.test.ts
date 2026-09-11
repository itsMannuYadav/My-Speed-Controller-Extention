import { test } from "node:test";
import assert from "node:assert/strict";
import { clampSpeed, clampStep, clampSeconds, clampOffset, sanitizePresets, isValidHostname, normalizeSpeed } from "./validate";

test("clampSpeed rejects NaN, Infinity, negative and zero", () => {
  assert.equal(clampSpeed(NaN, 1), 1);
  assert.equal(clampSpeed(Infinity, 1), 1);
  assert.equal(clampSpeed(-2, 1), 1);
  assert.equal(clampSpeed(0, 1), 1);
});

test("clampSpeed clamps to the supported [0.05, 16] range", () => {
  assert.equal(clampSpeed(100), 16);
  assert.equal(clampSpeed(0.0001), 0.05);
  assert.equal(clampSpeed(1.5), 1.5);
});

test("normalizeSpeed rounds away float drift", () => {
  assert.equal(normalizeSpeed(1.2000000001), 1.2);
});

test("clampStep and clampSeconds reject invalid input", () => {
  assert.equal(clampStep(NaN, 0.25), 0.25);
  assert.equal(clampStep(-1, 0.25), 0.25);
  assert.equal(clampSeconds(NaN, 10), 10);
  assert.equal(clampSeconds(-5, 10), 10);
  assert.equal(clampSeconds(9999, 10), 600);
});

test("sanitizePresets dedupes and falls back on bad input, but preserves given order", () => {
  // Order is preserved (not force-sorted) so users can manually reorder presets.
  assert.deepEqual(sanitizePresets([2, 1, 1, NaN, -1], [1]), [2, 1]);
  assert.deepEqual(sanitizePresets("not-an-array", [1, 2]), [1, 2]);
  assert.deepEqual(sanitizePresets([], [1, 2]), [1, 2]);
});

test("clampOffset rejects NaN/Infinity and caps extreme values", () => {
  assert.equal(clampOffset(NaN, 0), 0);
  assert.equal(clampOffset(Infinity, 0), 0);
  assert.equal(clampOffset(120.6, 0), 121);
  assert.equal(clampOffset(-9999, 0), -4000);
  assert.equal(clampOffset(9999, 0), 4000);
});

test("isValidHostname rejects whitespace and empty strings", () => {
  assert.equal(isValidHostname("youtube.com"), true);
  assert.equal(isValidHostname(""), false);
  assert.equal(isValidHostname("has space.com"), false);
  assert.equal(isValidHostname(123), false);
});
