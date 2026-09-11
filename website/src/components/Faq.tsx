import Container from "@/components/Container";
import { FAQ_ITEMS } from "@/lib/content";

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-border bg-surface/40">
      <Container className="py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8 flex max-w-2xl flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group rounded-xl border border-border bg-background p-4 open:pb-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
