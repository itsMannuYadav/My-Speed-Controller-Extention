import Container from "@/components/Container";

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
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Privacy is a feature, not a footnote.</h2>
          <p className="mt-3 text-muted">
            SpeedPilot only needs to see the page you&rsquo;re actively watching media on — nothing more.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {POINTS.map((point) => (
            <div key={point.title} className="rounded-2xl border border-border p-5">
              <h3 className="font-semibold">{point.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{point.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
