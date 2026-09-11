import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

export default function ScreenshotShowcase() {
  return (
    <section className="border-t border-border">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Not a mockup. The real thing.</h2>
            <p className="mt-3 text-muted">Actual screenshots of the actual extension — running on an actual YouTube video.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <figure className="group h-full overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
              <div className="relative aspect-[989/500] w-full bg-surface">
                <Image
                  src="/screenshots/overlay-live.png"
                  alt="The SpeedPilot on-video controller — a small −, 1.00×, + pill — floating over the top-right corner of a playing YouTube video"
                  fill
                  className="object-cover object-right-top"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
              <figcaption className="border-t border-border p-4 text-sm text-muted">
                The on-video controller, live on an actual YouTube video — not a recreation.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-2">
            <figure className="group h-full overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
              <div className="relative aspect-[1425/1000] w-full bg-surface">
                <Image
                  src="/screenshots/extension-options.png"
                  alt="SpeedPilot's Settings page, showing General options, speed presets, keyboard shortcuts, and site rules"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <figcaption className="border-t border-border p-4 text-sm text-muted">The full Settings page — presets, shortcuts, and site rules, all real.</figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
