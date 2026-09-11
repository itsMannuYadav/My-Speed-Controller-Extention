import Container from "@/components/Container";
import { DEFAULT_SHORTCUT_LIST } from "@/lib/content";

export default function ShortcutsSection() {
  return (
    <section id="shortcuts" className="scroll-mt-16 border-t border-border">
      <Container className="py-20">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Keyboard shortcuts, done right.</h2>
          <p className="mt-3 text-muted">
            These are the defaults — every one of them can be reassigned or disabled in Settings. None of them fire
            while you&rsquo;re typing in a search box, comment field, or any other text input.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border">
          {DEFAULT_SHORTCUT_LIST.map((item, i) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-5 py-4 ${i !== 0 ? "border-t border-border" : ""} ${
                i % 2 === 0 ? "bg-background" : "bg-surface/50"
              }`}
            >
              <span className="text-sm text-muted">{item.action}</span>
              <kbd className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-sm font-semibold">{item.key}</kbd>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
