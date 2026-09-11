import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import ScreenshotShowcase from "@/components/ScreenshotShowcase";
import FeaturesPreview from "@/components/FeaturesPreview";
import HowItWorks from "@/components/HowItWorks";
import InstallSection from "@/components/InstallSection";
import FaqPreview from "@/components/FaqPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <ScreenshotShowcase />
      <FeaturesPreview />
      <HowItWorks />
      <InstallSection />
      <FaqPreview />
    </>
  );
}
