import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { FAQ_ITEMS } from "@/lib/content";

const PREVIEW_COUNT = 3;

export default function FaqPreview() {
  const items = FAQ_ITEMS.slice(0, PREVIEW_COUNT);

  return (
    <section id="faq" className="scroll-mt-16 border-t border-border bg-surface/40">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
            <Link href="/faq" className="nav-link shrink-0 text-sm font-semibold text-accent">
              Read the full FAQ →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 flex max-w-2xl flex-col gap-3">
          {items.map((item, i) => (
            <Reveal key={item.question} delay={i * 60}>
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
    </section>
  );
}
