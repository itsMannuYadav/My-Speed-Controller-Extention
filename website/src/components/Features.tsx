import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { FEATURES } from "@/lib/content";
import { FEATURE_ICONS } from "@/components/icons";

export default function Features() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
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
  );
}
