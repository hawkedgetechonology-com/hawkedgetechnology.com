import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
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

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_token");

  return (
    <>
      <HeroSection />
      <TrustBarSection />
      
      {isLoggedIn ? (
        <>
          <ServicesSection />
          <WhyHawkEdgeSection />
          <AboutPreviewSection />
          <ProcessSection />
          <PortfolioSection />
          <TestimonialsSection />
          <FAQSection />
        </>
      ) : (
        <section className="py-24 bg-light-gray text-center relative border-y border-border-color">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Blurred background preview effect */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-transparent to-light-gray/90 backdrop-blur-sm z-0"></div>
          </div>
          <div className="max-w-2xl mx-auto px-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-soft-blue flex items-center justify-center mx-auto mb-6 shadow-sm border border-border-color">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-heading text-secondary mb-4 tracking-tight">Unlock Full Access</h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Create a free account to view our detailed services, project portfolio, and proprietary engineering process. Get immediate access to the HawkEdge workspace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <CTASection />
    </>
  );
}
