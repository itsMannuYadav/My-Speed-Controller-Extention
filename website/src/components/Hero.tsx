import Link from "next/link";
import { Play } from "lucide-react";
import PlaybackDemo from "@/components/PlaybackDemo";
import { EDGE_STORE_URL } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <Play className="h-3 w-3 fill-current text-accent" aria-hidden="true" /> Universal video speed controller
          </p>
          <h1 className="animate-fade-in-up mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ animationDelay: "70ms" }}>
            Control playback. <span className="text-accent">Your way.</span>
          </h1>
          <p className="animate-fade-in-up mt-5 max-w-lg text-lg leading-relaxed text-muted" style={{ animationDelay: "140ms" }}>
            Speed up, slow down, rewind, and fine-tune videos and audio across the web — with one consistent
            control layer, instead of hunting for a different speed menu on every site.
          </p>
          <div className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "210ms" }}>
            <Link
              href={EDGE_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get for Edge — it&rsquo;s free
            </Link>
            <Link
              href="/#install"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-surface"
            >
              Install on Chrome
            </Link>
          </div>
          <p className="animate-fade-in-up mt-5 text-xs text-muted" style={{ animationDelay: "260ms" }}>
            Free. No account. No tracking. Live on Edge Add-ons — Chrome Web Store coming soon.
          </p>
        </div>

        <div className="animate-fade-in-up flex justify-center lg:justify-end" style={{ animationDelay: "120ms" }}>
          <PlaybackDemo />
        </div>
      </div>
    </section>
  );
}
