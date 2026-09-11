"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, setTheme, type ThemePreference } from "@/lib/theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABEL: Record<ThemePreference, string> = { system: "System", light: "Light", dark: "Dark" };
const ICON: Record<ThemePreference, string> = { system: "🖥", light: "☀", dark: "☾" };

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    // Reads localStorage only after mount so the server-rendered "System" label
    // (which can't know the client's stored preference) matches the client's first
    // render, then updates once — the standard SSR-safe theme-toggle pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(getStoredTheme());
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setThemeState(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
    >
      <span aria-hidden="true">{ICON[theme]}</span>
      {LABEL[theme]}
    </button>
  );
}
