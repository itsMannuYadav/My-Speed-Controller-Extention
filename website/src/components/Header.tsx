"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import Logo from "@/components/Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-background/0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
          <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]">
            <Logo className="h-7 w-7" />
          </span>
          SpeedPilot
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link transition-colors hover:text-foreground" data-active={pathname === link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/#install"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Install
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
