import { HeroSection } from "@/components/sections/hero";
import { TrustBarSection } from "@/components/sections/trust-bar";
import { ServicesSection } from "@/components/sections/services";
import { WhyHawkEdgeSection } from "@/components/sections/why-hawkedge";
import { AboutPreviewSection } from "@/components/sections/about-preview";
import { ProcessSection } from "@/components/sections/our-process";
import { PortfolioSection } from "@/components/sections/portfolio";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CTASection } from "@/components/sections/cta";
import { FAQSection } from "@/components/sections/faq";

export const metadata = {
  title: "HawkEdge Technologies | Precision Software Engineering for Modern Enterprises",
  description:
    "HawkEdge Technologies builds scalable, secure, and maintainable software for growing businesses — from custom platforms and web applications to AI solutions and cloud infrastructure.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBarSection />
      <ServicesSection />
      <WhyHawkEdgeSection />
      <AboutPreviewSection />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
