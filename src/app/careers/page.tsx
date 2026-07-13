import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "Careers | HawkEdge Technologies",
  description: "Join the HawkEdge team and build the future of digital excellence.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader 
        title="Join Our Team" 
        subtitle="Build the future of digital excellence with a team of passionate engineers and designers."
      />
      
      <Section background="white" className="py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="bg-soft-blue rounded-3xl p-10 border border-border-color shadow-sm">
            <h3 className="text-2xl font-bold font-heading text-secondary mb-4">No Open Positions</h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Thank you for your interest in HawkEdge Technologies! At this time, our core founding team is fully focused on delivering exceptional value to our current clients, and we do not have any open roles.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              However, we are always excited to connect with talented developers, designers, and strategists. Feel free to submit your resume to our talent pool at <a href="mailto:hawkedgetechonology@gmail.com" className="text-primary hover:underline font-medium">hawkedgetechonology@gmail.com</a>, and we will reach out when a position opens up!
            </p>
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
