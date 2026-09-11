/** The SpeedPilot mark — the exact same shape as extension/icons/icon.svg, kept as
 * one inline component instead of an <img> so its colors can follow currentColor/
 * theme and it never needs a network request. */
export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true">
      <rect x="4" y="4" width="120" height="120" rx="28" fill="#4338CA" />
      <path d="M50 40 L90 64 L50 88 Z" fill="#FFFFFF" />
      <path d="M24 88 C 34 100, 50 106, 64 106" stroke="#A5B4FC" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M18 72 C 30 88, 48 96, 64 96" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.9" />
    </svg>
  );
}
