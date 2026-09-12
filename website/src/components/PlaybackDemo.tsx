"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { formatDuration, remainingRealTime, estimateTimeSavedRemaining } from "@speedpilot/shared";
import { useAnimatedNumber, useHoverCapable, usePrefersReducedMotion } from "@/lib/motion";

const DEMO_DURATION = 3600; // a representative 60-minute video
const DEMO_START_POSITION = 1200; // 20:00 already watched
const PRESETS = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 4.5];
const STEP = 0.25;
const MIN = 0.25;
const MAX = 4.5;
const GAUGE_RADIUS = 42;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

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
  const [pop, setPop] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const prevSpeed = useRef(speed);
  const hoverCapable = useHoverCapable();
  const reducedMotion = usePrefersReducedMotion();
  const displaySpeed = useAnimatedNumber(speed);

  useEffect(() => {
    if (prevSpeed.current === speed) return;
    prevSpeed.current = speed;
    setPop(true);
    const t = setTimeout(() => setPop(false), 320);
    return () => clearTimeout(t);
  }, [speed]);

  function onTilt(e: ReactPointerEvent<HTMLDivElement>) {
    if (!hoverCapable || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }
  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

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
  const gaugeProgress = (speed - MIN) / (MAX - MIN);
  const gaugeOffset = GAUGE_CIRCUMFERENCE * (1 - gaugeProgress);
  const streakDuration = Math.max(0.35, 1.9 - gaugeProgress * 1.5);

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-border bg-background/95 p-5 shadow-xl shadow-black/5 backdrop-blur transition-shadow duration-500 hover:shadow-2xl hover:shadow-accent/10"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 250ms cubic-bezier(0.16,1,0.3,1)",
      }}
      onPointerMove={onTilt}
      onPointerLeave={resetTilt}
    >
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>youtube.com (demo)</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">Video</span>
      </div>

      <div className="relative mt-5 flex items-center justify-center overflow-hidden py-2">
        <div className="absolute left-0 flex flex-col gap-1.5 opacity-70" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="sp-streak block h-0.5 rounded-full bg-accent"
              style={{ width: `${14 + i * 6}px`, animationDuration: `${streakDuration}s`, animationDelay: `${i * -0.25}s` }}
            />
          ))}
        </div>

        <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={GAUGE_RADIUS} fill="none" stroke="var(--sp-border)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={GAUGE_RADIUS}
            fill="none"
            stroke="var(--sp-accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={GAUGE_CIRCUMFERENCE}
            strokeDashoffset={gaugeOffset}
            style={{ transition: "stroke-dashoffset 280ms cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className={`absolute text-3xl font-extrabold tracking-tight tabular-nums ${pop ? "animate-speed-pop text-accent" : ""}`}>
          {displaySpeed.toFixed(2)}×
        </div>

        <div className="absolute right-0 flex flex-col gap-1.5 opacity-70" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="sp-streak block h-0.5 rounded-full bg-accent"
              style={{ width: `${14 + i * 6}px`, animationDuration: `${streakDuration}s`, animationDelay: `${i * -0.25 - 0.4}s` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Decrease demo speed"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition-all hover:border-accent hover:text-accent active:scale-90"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Increase demo speed"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition-all hover:border-accent hover:text-accent active:scale-90"
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
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all active:scale-90 ${
              Math.abs(p - speed) < 0.01 ? "border-accent bg-accent text-accent-contrast" : "border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {p}×
          </button>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div className="h-full rounded-full bg-accent transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => seek(-10)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold transition-all hover:bg-surface active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> 10s
        </button>
        <button
          type="button"
          onClick={() => seek(10)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold transition-all hover:bg-surface active:scale-95"
        >
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" /> 10s
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-center text-xs">
        <div className="rounded-lg bg-surface p-2.5 transition-colors duration-300">
          <dt className="text-muted">Remaining</dt>
          <dd className="mt-0.5 font-semibold tabular-nums">{remaining === null ? "—" : formatDuration(remaining)}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2.5 transition-colors duration-300">
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
