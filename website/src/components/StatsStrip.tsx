import Container from "@/components/Container";
import CountUp from "@/components/CountUp";
import { DEFAULT_SHORTCUT_LIST } from "@/lib/content";

const STATS = [
  { value: 16, suffix: "×", decimals: 0, label: "Max speed" },
  { value: DEFAULT_SHORTCUT_LIST.length, suffix: "", decimals: 0, label: "Keyboard shortcuts" },
  { value: 0, suffix: "", decimals: 0, label: "Trackers or analytics" },
  { value: 100, suffix: "%", decimals: 0, label: "Local by default" },
];

export default function StatsStrip() {
  return (
    <section className="border-t border-border">
      <Container className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-4 sm:gap-6 sm:py-12">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="sp-tile-in rounded-2xl border border-border bg-surface/60 px-4 py-5 text-center"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
            <p className="mt-1.5 text-xs font-medium text-muted sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
