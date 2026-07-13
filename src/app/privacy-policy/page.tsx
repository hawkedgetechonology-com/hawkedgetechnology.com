import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "Privacy Policy | HawkEdge Technologies",
  description: "HawkEdge Technologies Privacy Policy — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
      />

      <Section background="white" className="py-20">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-foreground/70 text-sm mb-8">Last updated: July 2026</p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">1. Information We Collect</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We collect information you provide directly to us when you submit a project inquiry, book a consultation, or contact us through our website. This may include your name, email address, phone number, company name, and project details.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We use the information we collect to respond to your inquiries, provide our services, communicate with you about your project, and improve our website and services. We do not sell, trade, or otherwise transfer your personally identifiable information to third parties.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">3. Data Security</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">4. Cookies</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Our website may use cookies to enhance user experience. You can choose to disable cookies through your browser settings, though this may affect certain functionality.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">5. Third-Party Links</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Our website may contain links to third-party websites. We have no control over the content or privacy practices of those sites and encourage you to review their privacy policies.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">6. Contact Us</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hawkedgetechonology@gmail.com" className="text-primary hover:underline">
              hawkedgetechonology@gmail.com
            </a>
            .
          </p>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
