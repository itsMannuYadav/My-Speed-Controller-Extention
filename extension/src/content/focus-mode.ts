/**
 * "Focus Mode": dims the rest of the page around the active video using the
 * spotlight/box-shadow technique — a single transparent, pointer-events:none div
 * sized to the video's bounding rect with a giant box-shadow covering everything
 * else. Never touches the host page's own DOM, z-index, or stacking context, so it
 * can't "fight" a site's own layout (per spec §9's constraint). The rAF loop that
 * keeps it aligned only runs while focus mode is actually on.
 */
export class FocusModeController {
  private host: HTMLDivElement | null = null;
  private spotlight: HTMLDivElement | null = null;
  private target: HTMLMediaElement | null = null;
  private rafId: number | null = null;

  sync(target: HTMLMediaElement | null): void {
    if (target === this.target) return;
    this.target = target;
    if (target) {
      this.mount();
      this.loop();
    } else {
      this.unmount();
    }
  }

  isActive(): boolean {
    return this.target !== null;
  }

  private mount(): void {
    if (this.host) return;
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483646;";
    const spotlight = document.createElement("div");
    spotlight.style.cssText = [
      "position:fixed",
      "pointer-events:none",
      "border-radius:8px",
      "transition:box-shadow 120ms ease",
      "box-shadow:0 0 0 9999px rgba(10,10,14,0.82)",
    ].join(";");
    host.appendChild(spotlight);
    document.documentElement.appendChild(host);
    this.host = host;
    this.spotlight = spotlight;
  }

  private unmount(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.host?.remove();
    this.host = null;
    this.spotlight = null;
  }

  private loop = (): void => {
    if (!this.target || !this.spotlight) return;
    if (!this.target.isConnected) {
      this.sync(null);
      return;
    }
    const rect = this.target.getBoundingClientRect();
    this.spotlight.style.left = `${rect.left}px`;
    this.spotlight.style.top = `${rect.top}px`;
    this.spotlight.style.width = `${rect.width}px`;
    this.spotlight.style.height = `${rect.height}px`;
    this.rafId = requestAnimationFrame(this.loop);
  };
}
