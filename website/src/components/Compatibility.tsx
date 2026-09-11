import Container from "@/components/Container";
import { COMPATIBILITY_NOTES } from "@/lib/content";

export default function Compatibility() {
  return (
    <section className="border-t border-border bg-surface/40">
      <Container className="py-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Where it works — honestly.</h2>
        <div className="mt-8 flex flex-col gap-4">
          {COMPATIBILITY_NOTES.map((note, i) => (
            <p key={i} className={`max-w-2xl text-sm leading-relaxed ${i === 0 ? "text-foreground font-medium" : "text-muted"}`}>
              {note}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
