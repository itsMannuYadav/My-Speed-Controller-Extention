import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Honest answers about what SpeedPilot can do, what it can't, and how it handles your privacy.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" description="Straight answers — including where SpeedPilot genuinely can't help." />
      <Faq />
    </>
  );
}
