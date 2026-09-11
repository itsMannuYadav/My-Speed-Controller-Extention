/** Minimal, dependency-free DOM builder — used instead of innerHTML templating so
 * dynamic text (hostnames, counts) is always set via textContent, never parsed as
 * markup. */
type ElProps<K extends keyof HTMLElementTagNameMap> = Omit<Partial<HTMLElementTagNameMap[K]>, "style"> & {
  className?: string;
  style?: string;
  attrs?: Record<string, string>;
};

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElProps<K> = {} as ElProps<K>,
  children: (Node | string | null | undefined | false)[] = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  const { attrs, style, ...rest } = props;
  Object.assign(node, rest);
  if (style) node.setAttribute("style", style);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node: Element): void {
  node.replaceChildren();
}

export function applyTheme(theme: "system" | "light" | "dark"): void {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}
