import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { WhyHawkEdgeSection } from "@/components/sections/why-hawkedge";
import { ProcessSection } from "@/components/sections/our-process";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "About Us | HawkEdge Technologies",
  description: "Learn about HawkEdge Technologies, a premium software engineering firm dedicated to building digital excellence.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader 
        title="About HawkEdge" 
        subtitle="We are a team of visionary founders and engineers dedicated to transforming ideas into digital excellence."
      />
      <WhyHawkEdgeSection />
      <ProcessSection />
      <CTASection />
    </>
  );
}
