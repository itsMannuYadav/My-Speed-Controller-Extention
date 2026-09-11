import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Features from "@/components/Features";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything SpeedPilot does for video and audio playback speed — and nothing it shouldn't.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything a speed controller should do."
        description="Nothing it shouldn't. No clutter, no features bolted on just to pad a list — twelve things SpeedPilot does well."
      />
      <Features />
    </>
  );
}
