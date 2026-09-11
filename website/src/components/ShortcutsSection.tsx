import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { DEFAULT_SHORTCUT_LIST } from "@/lib/content";
import { SHORTCUT_ICONS } from "@/components/icons";

export default function ShortcutsSection() {
  return (
    <section id="shortcuts" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Keyboard shortcuts, done right.</h2>
            <p className="mt-3 text-muted">
              These are the defaults — every one of them can be reassigned or disabled in Settings. None of them fire
              while you&rsquo;re typing in a search box, comment field, or any other text input.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            {DEFAULT_SHORTCUT_LIST.map((item, i) => {
              const Icon = SHORTCUT_ICONS[item.icon];
              return (
                <div
                  key={item.key}
                  className={`group flex items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-accent-soft/40 ${i !== 0 ? "border-t border-border" : ""} ${
                    i % 2 === 0 ? "bg-background" : "bg-surface/50"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
                    {item.action}
                  </span>
                  <kbd className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-sm font-semibold transition-transform duration-200 group-hover:scale-110 group-hover:border-accent">
                    {item.key}
                  </kbd>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
