import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ServicesSection } from "@/components/sections/services";
import { TechStackSection } from "@/components/sections/tech-stack";
import { FAQSection } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "Services | HawkEdge Technologies",
  description: "Explore our premium technology services including Custom Software Development, AI Solutions, Web Development, and Cloud Solutions.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader 
        title="Our Services" 
        subtitle="End-to-end technology solutions tailored to your unique business challenges and goals."
      />
      <ServicesSection />
      <TechStackSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
