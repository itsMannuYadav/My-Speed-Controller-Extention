"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

/** True once the viewer has a fine pointer that can hover (mouse/trackpad) —
 * gates decorative pointer-tracking effects (tilt, magnetic buttons) off on
 * touch devices, where they'd never trigger and just add dead event listeners. */
function matchesQuery(query: string) {
  return typeof window !== "undefined" ? window.matchMedia(query).matches : false;
}

export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(() => matchesQuery("(hover: hover) and (pointer: fine)"));
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setHoverCapable(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return hoverCapable;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => matchesQuery("(prefers-reduced-motion: reduce)"));
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Smoothly interpolates a numeric value on change instead of snapping — used
 * for the demo's speed readout so it reads as a live gauge, not a digital flip. */
export function useAnimatedNumber(target: number, durationMs = 280) {
  const [display, setDisplay] = useState(target);
  const reducedMotion = usePrefersReducedMotion();
  const frame = useRef<number | null>(null);
  const from = useRef(target);

  useEffect(() => {
    if (reducedMotion) {
      from.current = target;
      return;
    }
    const start = performance.now();
    const startValue = from.current;
    if (frame.current) cancelAnimationFrame(frame.current);

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = startValue + (target - startValue) * eased;
      setDisplay(value);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        from.current = target;
      }
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs, reducedMotion]);

  return reducedMotion ? target : display;
}

/** Nudges an element toward the pointer within its own bounds, spring-back on
 * leave. Inert (identity transform, no listeners fire) on touch devices and
 * under reduced motion. Takes the element's own ref (create it with useRef in
 * the component, not here — custom hooks shouldn't hand back refs) and spreads
 * the returned handlers/style onto that same element. */
export function useMagnetic<T extends HTMLElement>(elementRef: RefObject<T | null>, strength = 0.35) {
  const [transform, setTransform] = useState("translate(0px, 0px)");
  const hoverCapable = useHoverCapable();
  const reducedMotion = usePrefersReducedMotion();
  const active = hoverCapable && !reducedMotion;

  function onPointerMove(e: ReactPointerEvent<T>) {
    if (!active || !elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setTransform(`translate(${x}px, ${y}px)`);
  }
  function onPointerLeave() {
    setTransform("translate(0px, 0px)");
  }

  return {
    onPointerMove,
    onPointerLeave,
    style: { transform, transition: "transform 220ms cubic-bezier(0.16,1,0.3,1)" } satisfies CSSProperties,
  };
}
