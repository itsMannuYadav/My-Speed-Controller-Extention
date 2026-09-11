import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const CHROME_STEPS = [
  "Open chrome://extensions in a new tab.",
  "Turn on Developer mode (top-right toggle).",
  'Click "Load unpacked".',
  "Select the extension/dist build folder.",
];

const EDGE_STEPS = [
  "Open edge://extensions in a new tab.",
  "Turn on Developer mode (left sidebar toggle).",
  'Click "Load unpacked".',
  "Select the extension/dist build folder.",
];

export default function InstallSection() {
  return (
    <section id="install" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Install SpeedPilot</h2>
            <p className="mt-3 text-muted">
              SpeedPilot isn&rsquo;t on the Chrome Web Store or Edge Add-ons yet — for now it&rsquo;s loaded as an
              unpacked extension, which takes about a minute.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal delay={60}>
            <InstallCard browser="Chrome" steps={CHROME_STEPS} />
          </Reveal>
          <Reveal delay={120}>
            <InstallCard browser="Edge" steps={EDGE_STEPS} />
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/docs/installation"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]"
            >
              Full installation guide
            </Link>
            <p className="text-xs text-muted">Build the extension yourself with a couple of terminal commands — see the guide.</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function InstallCard({ browser, steps }: { browser: string; steps: string[] }) {
  return (
    <div className="group h-full rounded-2xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      <h3 className="font-semibold">{browser}</h3>
      <ol className="mt-4 flex flex-col gap-3 text-sm text-muted">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent transition-transform duration-300 group-hover:scale-110">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
