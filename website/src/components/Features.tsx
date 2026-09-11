import Container from "@/components/Container";
import { FEATURES } from "@/lib/content";

export default function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything a speed controller should do.</h2>
          <p className="mt-3 text-muted">Nothing it shouldn&rsquo;t. No clutter, no features bolted on just to pad a list.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-background p-5 transition-colors hover:border-accent/40">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-lg" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
