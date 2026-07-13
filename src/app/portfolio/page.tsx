import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PortfolioSection } from "@/components/sections/portfolio";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "Portfolio & Case Studies | HawkEdge Technologies",
  description: "View our recent work and client success stories at HawkEdge Technologies.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader 
        title="Featured Work" 
        subtitle="Explore our portfolio of successful projects and see how we've helped businesses achieve digital excellence."
      />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
