const TOAST_STYLES = `
  :host { all: initial; }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 28px;
    transform: translate(-50%, 8px);
    padding: 8px 16px;
    background: rgba(17, 17, 24, 0.9);
    color: #fff;
    border-radius: 999px;
    font: 600 12.5px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 160ms ease, transform 160ms ease;
    pointer-events: none;
    z-index: 2147483647;
    white-space: nowrap;
  }
  .toast.visible { opacity: 1; transform: translate(-50%, 0); }
`;

/**
 * A single, reused, page-level notification (§36 "use toast notifications
 * sparingly") for state changes that happen via keyboard shortcut — where there's
 * no popup open to show feedback in. Mounts once, lazily, and only runs a hide
 * timer while a message is actually showing.
 */
export class PageToast {
  private host: HTMLDivElement | null = null;
  private bubble: HTMLDivElement | null = null;
  private hideTimer: number | null = null;

  show(message: string): void {
    this.mountIfNeeded();
    if (!this.bubble) return;
    this.bubble.textContent = message;
    this.bubble.classList.add("visible");
    if (this.hideTimer !== null) window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => this.bubble?.classList.remove("visible"), 1800);
  }

  private mountIfNeeded(): void {
    if (this.host) return;
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = TOAST_STYLES;
    const bubble = document.createElement("div");
    bubble.className = "toast";
    shadow.append(style, bubble);
    document.documentElement.appendChild(host);
    this.host = host;
    this.bubble = bubble;
  }
}
