import type { Metadata } from "next";
import type { ReactNode } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import PermissionsTable from "@/components/PermissionsTable";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Installation Guide",
  description: "Build and load the SpeedPilot extension in Chrome or Edge.",
};

export default function InstallationPage() {
  return (
    <>
      <PageHero
        eyebrow="Install"
        title="Installing SpeedPilot"
        description="SpeedPilot isn't published to the Chrome Web Store or Edge Add-ons yet, so for now it's built from source and loaded as an unpacked extension. The whole process takes a couple of minutes."
      />

      <Container className="py-16 sm:py-20">
        <Reveal>
          <section>
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
              <h2 className="text-xl font-bold">2b. Load in Edge</h2>
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
