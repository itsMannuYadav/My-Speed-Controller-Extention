import type { ReactNode } from "react";
import Container from "@/components/Container";

/** Consistent top-of-page heading used by every non-home page (/features,
 * /how-it-works, /shortcuts, /faq, /privacy, /docs/installation). */
export default function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-border bg-surface/40">
      <Container className="py-14 sm:py-20">
        <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="animate-fade-in-up mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ animationDelay: "60ms" }}>
          {title}
        </h1>
        {description ? (
          <p className="animate-fade-in-up mt-4 max-w-xl text-muted" style={{ animationDelay: "120ms" }}>
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
