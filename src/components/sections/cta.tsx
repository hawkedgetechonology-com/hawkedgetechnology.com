import React from "react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

export function CTASection() {
  return (
    <Section background="white" className="pb-32">
      <div className="bg-secondary rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
        {/* Subtle top-right accent */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "var(--primary)", filter: "blur(80px)", transform: "translate(30%, -30%)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight leading-tight">
            Ready to Build Software{" "}
            <span className="text-primary">That Scales?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/75 mb-10 leading-relaxed">
            Let&apos;s start with a conversation. Tell us what you&apos;re building and we&apos;ll tell you exactly how we can help — no pitch, no pressure.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/contact">
              <Button
                variant="primary"
                size="lg"
                className="gap-2 cursor-pointer hover-elevate"
                id="cta-primary-consultation"
              >
                Book a Free Consultation <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white cursor-pointer hover-elevate"
                id="cta-secondary-portfolio"
              >
                Explore Our Work
              </Button>
            </Link>
          </div>

          {/* Trust microcopy */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Clock size={14} />
            <span>Response within 24 hours · No commitment required · 30-minute discovery call</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
