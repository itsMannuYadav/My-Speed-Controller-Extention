import Container from "@/components/Container";
import { HOW_IT_WORKS } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-border bg-surface/40">
      <Container className="py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step}>
              <span className="text-sm font-bold text-accent">{item.step}</span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
