import { CTASection } from "@/components/landing/CTASection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { PricingSection } from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
