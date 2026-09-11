import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PrivacySection from "@/components/PrivacySection";
import PermissionsTable from "@/components/PermissionsTable";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy",
  description: "SpeedPilot's local-first privacy architecture, and exactly why each browser permission is requested.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Local-first, by design."
        description="SpeedPilot only ever needs the page you're actively watching media on. Here's exactly what that means in practice."
      />
      <PrivacySection />
      <Container className="py-16 sm:py-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why each permission is requested</h2>
          <p className="mt-3 max-w-xl text-muted">Reviewed one by one before shipping — nothing broad is requested just because it&rsquo;s convenient.</p>
        </Reveal>
        <Reveal delay={80} className="mt-8">
          <PermissionsTable />
        </Reveal>
      </Container>
    </>
  );
}
