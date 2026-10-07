/** The My Speed Up mark — the exact same shape as extension/icons/icon.svg, kept as
 * one inline component instead of an <img> so its colors can follow currentColor/
 * theme and it never needs a network request. */
export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true">
<defs>
    <linearGradient id="mu-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#6366F1"/>
      <stop offset="0.55" stopColor="#4F46E5"/>
      <stop offset="1" stopColor="#7C3AED"/>
    </linearGradient>
    <linearGradient id="mu-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28"/>
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"/>
    </linearGradient>
    <linearGradient id="mu-play" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF"/>
      <stop offset="1" stopColor="#E0E7FF"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#mu-bg)"/>
  <path d="M4 32 a28 28 0 0 1 28 -28 h64 a28 28 0 0 1 28 28 v22 c-30 14 -90 14 -120 0 z" fill="url(#mu-gloss)"/>
  <g fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 44 L33 64 L17 84" opacity="0.32"/>
    <path d="M38 44 L54 64 L38 84" opacity="0.62"/>
  </g>
  <path d="M68 36 L106 64 L68 92 Z" fill="url(#mu-play)" stroke="url(#mu-play)" strokeWidth="9" strokeLinejoin="round"/>
</svg>
  );
}
