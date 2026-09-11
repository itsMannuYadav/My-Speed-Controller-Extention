import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import HowItWorks from "@/components/HowItWorks";
import Compatibility from "@/components/Compatibility";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Install, open a video, and control playback — plus an honest look at what SpeedPilot can and can't reach.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Three steps. No account, no setup wizard."
        description="Install the extension, open a page with a video or audio player, and control it — from the popup, the on-video controller, or your keyboard."
      />
      <HowItWorks />
      <Compatibility />
    </>
  );
}
