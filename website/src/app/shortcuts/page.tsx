import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ShortcutsSection from "@/components/ShortcutsSection";

export const metadata: Metadata = {
  title: "Keyboard Shortcuts",
  description: "SpeedPilot's default keyboard shortcuts — every one reassignable or disabled from Settings.",
};

export default function ShortcutsPage() {
  return (
    <>
      <PageHero
        eyebrow="Shortcuts"
        title="Fast, configurable, and out of your way."
        description="These are just the defaults. Rebind or disable any of them individually in Settings — and none of them ever steal a keystroke while you're typing."
      />
      <ShortcutsSection />
    </>
  );
}
