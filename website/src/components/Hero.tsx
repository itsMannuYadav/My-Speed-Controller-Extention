import PlaybackDemo from "@/components/PlaybackDemo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span aria-hidden="true">▶</span> Universal video speed controller
          </p>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Control playback. <span className="text-accent">Your way.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Speed up, slow down, rewind, and fine-tune videos and audio across the web — with one consistent
            control layer, instead of hunting for a different speed menu on every site.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Install Extension
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              See How It Works
            </a>
          </div>
          <p className="mt-5 text-xs text-muted">Free. No account. No tracking. Works on Chrome and Edge.</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PlaybackDemo />
        </div>
      </div>
    </section>
  );
}
