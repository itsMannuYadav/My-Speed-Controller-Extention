import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { FEATURES, type FeatureIconKey } from "@/lib/content";
import { FEATURE_ICONS } from "@/components/icons";

const HIGHLIGHT_KEYS: FeatureIconKey[] = ["zap", "keyboard", "pin", "refresh", "timer", "focus"];

export default function FeaturesPreview() {
  const highlights = HIGHLIGHT_KEYS.map((key) => FEATURES.find((f) => f.icon === key)!).filter(Boolean);

  return (
    <section id="features" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything a speed controller should do.</h2>
              <p className="mt-3 text-muted">Nothing it shouldn&rsquo;t. No clutter, no features bolted on just to pad a list.</p>
            </div>
            <Link href="/features" className="nav-link shrink-0 text-sm font-semibold text-accent">
              See all 12 features →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <Reveal key={feature.title} delay={(i % 3) * 60}>
                <div className="group h-full rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
