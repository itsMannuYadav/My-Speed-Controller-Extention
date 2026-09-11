import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ShortcutsSection from "@/components/ShortcutsSection";
import Compatibility from "@/components/Compatibility";
import PrivacySection from "@/components/PrivacySection";
import Faq from "@/components/Faq";
import InstallSection from "@/components/InstallSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <Features />
      <HowItWorks />
      <ShortcutsSection />
      <Compatibility />
      <PrivacySection />
      <Faq />
      <InstallSection />
    </>
  );
}
