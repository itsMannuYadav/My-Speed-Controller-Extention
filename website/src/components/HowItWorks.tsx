import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { HOW_IT_WORKS } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={i * 90}>
              <div className="group">
                <span className="inline-block text-sm font-bold text-accent transition-transform duration-300 group-hover:translate-x-1">{item.step}</span>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
