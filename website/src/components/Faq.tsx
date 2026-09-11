import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { FAQ_ITEMS } from "@/lib/content";

export default function Faq() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="flex max-w-2xl flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={Math.min(i, 5) * 40}>
            <details className="group rounded-xl border border-border bg-background p-4 transition-colors duration-200 open:pb-4 hover:border-accent/40 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-accent">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
