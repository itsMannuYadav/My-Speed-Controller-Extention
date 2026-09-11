import Container from "@/components/Container";

const PROBLEMS = [
  "don't expose speed controls at all",
  "limit you to a handful of preset speeds",
  "bury the control behind two or three clicks",
  "use inconsistent or non-configurable shortcuts",
  "reset your speed back to 1× on every new video",
  "make speed control difficult or impossible on embedded players",
];

export default function WhySection() {
  return (
    <section className="border-t border-border bg-surface/40">
      <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Every site does speed control differently.</h2>
          <p className="mt-4 max-w-md text-muted">
            Some websites:
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PROBLEMS.map((problem) => (
            <li key={problem} className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-4 text-sm text-muted">
              <span aria-hidden="true" className="mt-0.5 text-danger">
                ✕
              </span>
              {problem}
            </li>
          ))}
        </ul>
      </Container>
      <Container className="pb-20">
        <p className="max-w-2xl text-lg font-medium">
          SpeedPilot provides one consistent control layer — the same shortcuts, the same popup, the same on-video
          controller — no matter which site you&rsquo;re on.
        </p>
      </Container>
    </section>
  );
}
