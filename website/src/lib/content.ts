// Centralized site copy — one place to edit headings/body text instead of
// scattering strings across every component.

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#shortcuts", label: "Shortcuts" },
  { href: "#faq", label: "FAQ" },
];

export const DEFAULT_SHORTCUT_LIST = [
  { key: "A", action: "Decrease speed" },
  { key: "D", action: "Increase speed" },
  { key: "S", action: "Reset to 1×" },
  { key: "Z", action: "Rewind" },
  { key: "X", action: "Forward" },
  { key: "V", action: "Toggle on-video controller" },
];

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: "⚡",
    title: "Instant speed control",
    description: "Adjust playback from 0.05× to 16× in a click. Extreme values are clamped gracefully when a player can't keep up.",
  },
  {
    icon: "🎚",
    title: "Fine-grained speed",
    description: "Set your own step size and preset list — 0.75×, 1.1×, 1.75×, whatever fits how you actually watch.",
  },
  {
    icon: "⌨",
    title: "Keyboard shortcuts",
    description: "A/D/S/Z/X/V by default, fully reassignable, and automatically disabled while you're typing anywhere on the page.",
  },
  {
    icon: "⏪",
    title: "Smart rewind & forward",
    description: "Configurable skip length — 5, 10, 15, 30 seconds, or your own value — for both directions.",
  },
  {
    icon: "📌",
    title: "Per-site speed memory",
    description: "YouTube at 1.5×, lecture platforms at 1.75×, everything else at 1× — SpeedPilot remembers by hostname.",
  },
  {
    icon: "🎬",
    title: "Multiple videos, handled",
    description: "Apply a speed to just the active player or every media element on the page — your choice, every time.",
  },
  {
    icon: "🔄",
    title: "Dynamic media detection",
    description: "A single MutationObserver — not a polling loop — catches videos a site loads in after the page first renders.",
  },
  {
    icon: "📺",
    title: "On-video controller",
    description: "A small floating −/+ readout over the player itself. Always on, on hover, auto-hide, or off — your call.",
  },
  {
    icon: "⏱",
    title: "Time remaining, recalculated",
    description: "Remaining time and time saved update live as you change speed — without touching the video's real duration.",
  },
  {
    icon: "🖼",
    title: "Picture-in-Picture",
    description: "One click when the browser and player support it. Disabled — never broken — when they don't.",
  },
  {
    icon: "🖥",
    title: "Focus mode",
    description: "Dims everything but the player, without touching the host page's own layout or z-index.",
  },
  {
    icon: "🔊",
    title: "Video and audio",
    description: "Podcasts, lecture recordings, and audio-only players get the same controls as video.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Install",
    description: "Add SpeedPilot to Chrome or Edge — it does nothing until a page actually has media on it.",
  },
  {
    step: "02",
    title: "Open a video",
    description: "Visit any site with standard HTML5 video or audio. SpeedPilot detects it automatically, including content loaded in later.",
  },
  {
    step: "03",
    title: "Control playback",
    description: "Use the popup, the on-video controller, or keyboard shortcuts — whichever fits the moment.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Does it work on YouTube?",
    answer: "It works with standard HTML5 media on YouTube, subject to changes YouTube makes to its own player over time.",
  },
  {
    question: "Does it work on online courses and lecture platforms?",
    answer: "Yes, whenever the course player exposes a controllable HTML5 <video> or <audio> element — which most do.",
  },
  {
    question: "Can I use custom speeds?",
    answer: "Yes. Type an exact value, drag the slider, or add your own presets in Settings — the supported range is 0.05× to 16×.",
  },
  {
    question: "Can I remember a different speed for each website?",
    answer: "Yes — enable “Remember for this site” in the popup, or manage every saved site from the Settings page.",
  },
  {
    question: "Does it work with audio, like podcasts?",
    answer: "Yes. Any <audio> element gets the same speed controls, rewind/forward, and remaining-time readout as video.",
  },
  {
    question: "Does it collect my browsing history?",
    answer: "No. SpeedPilot has no analytics, no trackers, and makes no network requests of its own. Settings stay in your browser's local extension storage unless you explicitly turn on sync.",
  },
  {
    question: "Can I use keyboard shortcuts?",
    answer: "Yes, and every shortcut is reassignable or can be turned off individually in Settings. They never fire while you're typing in a text field.",
  },
  {
    question: "Does it work on Microsoft Edge?",
    answer: "Yes — SpeedPilot is built on Manifest V3 and standard Chromium extension APIs, so the same build runs on Chrome, Edge, and other Chromium-based browsers.",
  },
];

export const COMPATIBILITY_NOTES = [
  "Works with standard HTML5 video and audio players across the web — including same-origin embedded players used by many course and lecture platforms.",
  "Some sites use custom, DRM-protected, cross-origin, or otherwise restricted players where browser extensions genuinely cannot control playback. That's a browser security boundary, not a bug we can patch around.",
  "Live streams show a “Live” indicator instead of a remaining-time estimate — speed control still works wherever the stream's player allows it.",
];

export const PERMISSION_NOTES = [
  {
    permission: "storage",
    reason: "Save your settings and per-site speed rules locally (and, only if you opt in, to browser sync).",
  },
  {
    permission: "sidePanel",
    reason: "Power the optional richer side-panel view.",
  },
  {
    permission: "host permissions (http/https)",
    reason:
      "A universal speed controller has to be able to reach media on any site you visit — this is the one broad permission SpeedPilot genuinely needs. It's also what makes reading the active tab and messaging its content script work without a separate activeTab grant, since that permission adds nothing once broad host access already exists. Nothing else is requested.",
  },
];
