export type TrackedMedia = HTMLMediaElement;

/**
 * Tracks every `<video>`/`<audio>` element discovered on the page (including
 * accessible same-origin iframes). Deduplicates via a WeakMap so the same element
 * is never registered twice, and prunes elements that have left the document
 * (SPA swaps a player out) whenever the registry is read.
 */
export class MediaRegistry {
  private idsByElement = new WeakMap<TrackedMedia, string>();
  private elementsById = new Map<string, TrackedMedia>();
  private counter = 0;
  private listeners = new Set<() => void>();

  register(element: TrackedMedia): string {
    const existing = this.idsByElement.get(element);
    if (existing) return existing;
    const id = `m${++this.counter}`;
    this.idsByElement.set(element, id);
    this.elementsById.set(id, element);
    this.notify();
    return id;
  }

  unregister(element: TrackedMedia): void {
    const id = this.idsByElement.get(element);
    if (!id) return;
    this.idsByElement.delete(element);
    this.elementsById.delete(id);
    this.notify();
  }

  idFor(element: TrackedMedia): string | undefined {
    return this.idsByElement.get(element);
  }

  get(id: string): TrackedMedia | undefined {
    const el = this.elementsById.get(id);
    if (el && !el.isConnected) {
      this.unregister(el);
      return undefined;
    }
    return el;
  }

  /** All currently-connected tracked elements, pruning any that were removed
   * from the document without a MutationObserver callback catching it yet. */
  list(): TrackedMedia[] {
    const alive: TrackedMedia[] = [];
    for (const [id, el] of this.elementsById) {
      if (el.isConnected) {
        alive.push(el);
      } else {
        this.elementsById.delete(id);
      }
    }
    return alive;
  }

  onChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}
