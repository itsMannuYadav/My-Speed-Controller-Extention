"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface"
      >
        {open ? <X className="h-[18px] w-[18px]" aria-hidden="true" /> : <Menu className="h-[18px] w-[18px]" aria-hidden="true" />}
      </button>

      {open && (
        <div className="animate-fade-in-up fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-1 overflow-y-auto border-t border-border bg-background p-5">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`animate-fade-in-up rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-surface ${
                pathname === link.href ? "bg-accent-soft text-accent" : "text-foreground"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#install"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-base font-semibold text-accent-contrast transition-transform active:scale-[0.98]"
          >
            Install SpeedPilot
          </Link>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
