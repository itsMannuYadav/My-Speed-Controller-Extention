import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { PRIVACY_ICONS } from "@/components/icons";

const POINTS = [
  { title: "No browsing history collected", description: "SpeedPilot never records which sites you visit or what you watch." },
  { title: "No analytics, no trackers", description: "No usage analytics, ads, or third-party scripts are bundled with the extension." },
  { title: "Local-first storage", description: "Settings and site rules live in your browser's local extension storage by default." },
  { title: "Sync is opt-in and explicit", description: "Turning on sync mirrors only settings and site rules — never browsing data — and it's off unless you enable it." },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Privacy is a feature, not a footnote.</h2>
            <p className="mt-3 text-muted">SpeedPilot only needs to see the page you&rsquo;re actively watching media on — nothing more.</p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {POINTS.map((point, i) => {
            const Icon = PRIVACY_ICONS[i];
            return (
              <Reveal key={point.title} delay={(i % 2) * 80}>
                <div className="group h-full rounded-2xl border border-border p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{point.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
