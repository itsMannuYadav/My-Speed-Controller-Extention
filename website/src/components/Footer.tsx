import Link from "next/link";
import { NAV_LINKS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm text-accent-contrast" aria-hidden="true">
              ▶
            </span>
            SpeedPilot
          </div>
          <p className="mt-3 text-sm text-muted">
            Control playback. Your way. A local-first, privacy-first video speed controller for Chrome and Edge.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-semibold">Product</h3>
            <ul className="flex flex-col gap-2 text-muted">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Install</h3>
            <ul className="flex flex-col gap-2 text-muted">
              <li>
                <Link href="/docs/installation" className="hover:text-foreground">
                  Installation guide
                </Link>
              </li>
              <li>
                <a href="#install" className="hover:text-foreground">
                  Load unpacked
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Trust</h3>
            <ul className="flex flex-col gap-2 text-muted">
              <li>
                <a href="#privacy" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        SpeedPilot is an independent project and isn&rsquo;t affiliated with any website it can control playback on.
      </div>
    </footer>
  );
}
