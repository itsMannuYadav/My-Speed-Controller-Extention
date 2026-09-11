"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-1 overflow-y-auto border-t border-border bg-background p-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#install"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-base font-semibold text-accent-contrast"
          >
            Install SpeedPilot
          </a>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
