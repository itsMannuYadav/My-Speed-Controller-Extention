import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import PermissionsTable from "@/components/PermissionsTable";
import Reveal from "@/components/Reveal";
import { EDGE_STORE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Installation Guide",
  description: "Get SpeedPilot from Edge Add-ons, or build and load it in Chrome.",
};

export default function InstallationPage() {
  return (
    <>
      <PageHero
        eyebrow="Install"
        title="Installing SpeedPilot"
        description="SpeedPilot is live on Edge Add-ons — one click and you're set. It isn't on the Chrome Web Store yet, so for now Chrome needs a build-from-source, unpacked install. The whole process takes a couple of minutes."
      />

      <Container className="py-16 sm:py-20">
        <Reveal>
          <section className="flex flex-col items-start gap-3 rounded-2xl border border-accent/40 bg-accent-soft/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Using Edge?</h2>
              <p className="mt-1 text-sm text-muted">Skip the steps below — install directly from the Microsoft Edge Add-ons store.</p>
            </div>
            <Link
              href={EDGE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
            >
              Get for Edge
            </Link>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="mt-12">
            <h2 className="text-xl font-bold">1. Build the extension</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">From the root of the project:</p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm transition-colors duration-300 hover:border-accent/30">
              <code>{`npm install\nnpm run build:extension`}</code>
            </pre>
            <p className="mt-3 text-sm text-muted">
              This produces a ready-to-load build in <code className="rounded bg-surface px-1.5 py-0.5">extension/dist</code>.
            </p>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">2a. Load in Chrome</h2>
              <ol className="mt-4 flex flex-col gap-3 text-sm text-muted">
                <Step n={1}>
                  Open <code className="rounded bg-surface px-1.5 py-0.5">chrome://extensions</code>
                </Step>
                <Step n={2}>Turn on Developer mode (top-right toggle).</Step>
                <Step n={3}>
                  Click <strong className="text-foreground">Load unpacked</strong>.
                </Step>
                <Step n={4}>
                  Select the <code className="rounded bg-surface px-1.5 py-0.5">extension/dist</code> folder.
                </Step>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-bold">2b. Load in Edge (dev build)</h2>
              <p className="mt-1 text-xs text-muted">Only needed for a source build — most people should just use the store link above.</p>
              <ol className="mt-4 flex flex-col gap-3 text-sm text-muted">
                <Step n={1}>
                  Open <code className="rounded bg-surface px-1.5 py-0.5">edge://extensions</code>
                </Step>
                <Step n={2}>Turn on Developer mode (left sidebar toggle).</Step>
                <Step n={3}>
                  Click <strong className="text-foreground">Load unpacked</strong>.
                </Step>
                <Step n={4}>
                  Select the <code className="rounded bg-surface px-1.5 py-0.5">extension/dist</code> folder.
                </Step>
              </ol>
            </div>
          </section>
        </Reveal>

        <Reveal delay={140}>
          <section className="mt-12">
            <h2 className="text-xl font-bold">3. Try it</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Open any page with an HTML5 video or audio element and play it. Click the SpeedPilot icon in your
              toolbar, or use the default shortcuts (<kbd className="rounded border border-border px-1">A</kbd>/
              <kbd className="rounded border border-border px-1">D</kbd> to step speed,{" "}
              <kbd className="rounded border border-border px-1">S</kbd> to reset).
            </p>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="mt-12">
            <h2 className="text-xl font-bold">Why each permission is requested</h2>
            <div className="mt-5">
              <PermissionsTable />
            </div>
          </section>
        </Reveal>
      </Container>
    </>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="group flex gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent transition-transform duration-300 group-hover:scale-110">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}
