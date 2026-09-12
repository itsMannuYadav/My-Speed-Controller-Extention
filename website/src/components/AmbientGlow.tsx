/** Slow-drifting blurred gradient blobs behind the hero — pure CSS, no JS, so it
 * costs nothing on mobile and is automatically stilled by the global
 * prefers-reduced-motion rule in globals.css. Sized in vw/vh so it scales down
 * cleanly on phones instead of overflowing. */
export default function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="sp-glow sp-glow-a absolute -left-[10vw] -top-[15vw] h-[55vw] w-[55vw] max-h-[420px] max-w-[420px] min-h-[220px] min-w-[220px] rounded-full bg-accent/20 blur-3xl" />
      <div className="sp-glow sp-glow-b absolute -right-[12vw] top-[5vw] h-[45vw] w-[45vw] max-h-[380px] max-w-[380px] min-h-[180px] min-w-[180px] rounded-full bg-accent/15 blur-3xl" />
      <div className="sp-glow sp-glow-c absolute bottom-[-18vw] left-[20vw] h-[40vw] w-[40vw] max-h-[320px] max-w-[320px] min-h-[160px] min-w-[160px] rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
}
