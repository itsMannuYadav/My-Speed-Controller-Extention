import type { MediaRegistry } from "./media-registry";

const MEDIA_SELECTOR = "video, audio";

/**
 * Finds `<video>`/`<audio>` elements — on first scan and whenever the DOM changes
 * afterward — and feeds them into a MediaRegistry. Uses a single MutationObserver
 * instead of polling, and debounces bursts of mutations (SPA re-renders often touch
 * dozens of nodes at once) into one re-scan per animation frame.
 *
 * Also walks same-origin iframes, since embedded course/lecture players are common.
 * Cross-origin iframes throw on `.contentDocument` access and are skipped — that's a
 * genuine browser security boundary the content script cannot cross, not a bug.
 */
export class MediaDetector {
  private observer: MutationObserver | null = null;
  private scheduled = false;
  private seenIframes = new WeakSet<HTMLIFrameElement>();

  constructor(private registry: MediaRegistry) {}

  start(): void {
    this.scan();
    this.observer = new MutationObserver(() => this.scheduleScan());
    this.observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private scheduleScan(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.scheduled = false;
      this.scan();
    });
  }

  private scan(): void {
    this.scanDocument(document);
    for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
      this.trackIframe(iframe);
    }
  }

  private trackIframe(iframe: HTMLIFrameElement): void {
    let doc: Document | null = null;
    try {
      doc = iframe.contentDocument;
    } catch {
      return; // cross-origin — inaccessible by design, skip gracefully
    }
    if (!doc) return;
    this.scanDocument(doc);
    if (!this.seenIframes.has(iframe)) {
      this.seenIframes.add(iframe);
      // Same-origin iframe content can load after the outer page settles; re-scan
      // once it finishes loading instead of polling.
      iframe.addEventListener("load", () => this.scheduleScan(), { once: true });
    }
  }

  private scanDocument(doc: Document): void {
    const elements = doc.querySelectorAll<HTMLMediaElement>(MEDIA_SELECTOR);
    for (const el of Array.from(elements)) {
      this.registry.register(el);
    }
  }
}
