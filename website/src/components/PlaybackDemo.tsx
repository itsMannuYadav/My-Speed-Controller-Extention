"use client";

import { useMemo, useState } from "react";
import { formatDuration, remainingRealTime, estimateTimeSavedRemaining } from "@speedpilot/shared";

const DEMO_DURATION = 3600; // a representative 60-minute video
const DEMO_START_POSITION = 1200; // 20:00 already watched
const PRESETS = [0.75, 1, 1.25, 1.5, 1.75, 2, 3];
const STEP = 0.25;
const MIN = 0.25;
const MAX = 3;

/**
 * The homepage's interactive demo (planning doc §7 hero mockup + §50 interactive
 * demo). Duration/position are a fixed illustrative scenario — not a simulated video
 * playing — but every number shown (remaining time, time saved) runs through the
 * exact same @speedpilot/shared calculator the real extension uses, so it's
 * mathematically real, just not attached to a live media element.
 */
export default function PlaybackDemo() {
  const [speed, setSpeed] = useState(1.5);
  const [position, setPosition] = useState(DEMO_START_POSITION);

  const remaining = useMemo(
    () => remainingRealTime({ duration: DEMO_DURATION, currentTime: position, playbackRate: speed }),
    [position, speed]
  );
  const saved = useMemo(
    () => estimateTimeSavedRemaining({ duration: DEMO_DURATION, currentTime: position, playbackRate: speed }),
    [position, speed]
  );

  function step(direction: 1 | -1) {
    setSpeed((s) => Math.min(MAX, Math.max(MIN, Math.round((s + direction * STEP) * 100) / 100)));
  }
  function seek(deltaSeconds: number) {
    setPosition((p) => Math.min(DEMO_DURATION, Math.max(0, p + deltaSeconds)));
  }

  const progressPct = (position / DEMO_DURATION) * 100;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-background/95 p-5 shadow-xl shadow-black/5 backdrop-blur">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>youtube.com (demo)</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">Video</span>
      </div>

      <div className="mt-5 text-center">
        <div className="text-4xl font-extrabold tracking-tight tabular-nums">{speed.toFixed(2)}×</div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Decrease demo speed"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition-colors hover:border-accent hover:text-accent"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Increase demo speed"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition-colors hover:border-accent hover:text-accent"
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={MIN}
        max={MAX}
        step={0.05}
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        aria-label="Demo playback speed"
        className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
      />

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setSpeed(p)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
              Math.abs(p - speed) < 0.01 ? "border-accent bg-accent text-accent-contrast" : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {p}×
          </button>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => seek(-10)}
          className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold transition-colors hover:bg-surface"
        >
          ↶ 10s
        </button>
        <button
          type="button"
          onClick={() => seek(10)}
          className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold transition-colors hover:bg-surface"
        >
          ↷ 10s
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
        <div className="rounded-lg bg-surface p-2.5">
          <dt className="text-muted">Remaining</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{remaining === null ? "—" : formatDuration(remaining)}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2.5">
          <dt className="text-muted">Time saved</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-accent">{saved > 0 ? `~${formatDuration(saved)}` : "—"}</dd>
        </div>
      </dl>

      <p className="mt-3 text-center text-[11px] text-muted">
        Keyboard: <kbd className="rounded border border-border px-1 py-0.5 font-mono">A</kbd> /{" "}
        <kbd className="rounded border border-border px-1 py-0.5 font-mono">D</kbd> to step speed,{" "}
        <kbd className="rounded border border-border px-1 py-0.5 font-mono">S</kbd> to reset.
      </p>
    </div>
  );
}
