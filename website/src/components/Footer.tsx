import Link from "next/link";
import { NAV_LINKS, EDGE_STORE_URL } from "@/lib/content";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo className="h-7 w-7" />
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
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Install</h3>
            <ul className="flex flex-col gap-2 text-muted">
              <li>
                <Link href={EDGE_STORE_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
                  Get for Edge
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="transition-colors hover:text-foreground">
                  Installation guide
                </Link>
              </li>
              <li>
                <Link href="/#install" className="transition-colors hover:text-foreground">
                  Install on Chrome
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold">Trust</h3>
            <ul className="flex flex-col gap-2 text-muted">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-foreground">
                  FAQ
                </Link>
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
