import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/sections/cta";

export const metadata = {
  title: "Terms & Conditions | HawkEdge Technologies",
  description: "HawkEdge Technologies Terms and Conditions — the rules governing use of our website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        subtitle="The rules and guidelines governing use of our website and services."
      />

      <Section background="white" className="py-20">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <p className="text-foreground/70 text-sm mb-8">Last updated: July 2026</p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            By accessing and using the HawkEdge Technologies website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">2. Use of the Website</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You may not use the site to transmit harmful, offensive, or inappropriate content.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">3. Intellectual Property</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            All content on this website, including text, graphics, logos, and images, is the property of HawkEdge Technologies and is protected by applicable copyright and trademark laws. You may not reproduce or distribute any content without prior written permission.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">4. Disclaimer of Warranties</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            This website is provided on an &quot;as is&quot; basis without warranties of any kind, either express or implied. HawkEdge Technologies does not warrant that the website will be error-free or uninterrupted.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">5. Limitation of Liability</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            HawkEdge Technologies shall not be liable for any indirect, incidental, or consequential damages arising out of your use of or inability to use the website or its content.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">6. Changes to Terms</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-bold font-heading text-secondary mt-10 mb-4">7. Contact Us</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            If you have any questions about these Terms and Conditions, please contact us at{" "}
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
