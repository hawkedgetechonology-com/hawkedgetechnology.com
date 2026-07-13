import React from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { Target, Eye, Code2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    label: "Mission",
    headline: "Engineer software that creates lasting business value.",
    body: "We exist to help ambitious businesses build technology that works — reliably, securely, and at scale. Not just for today's requirements, but for the growth that comes next.",
  },
  {
    icon: Eye,
    label: "Vision",
    headline: "Enterprise-grade software accessible to every growing business.",
    body: "We believe the gap between enterprise technology and growing businesses should not exist. We bridge it through disciplined engineering, honest advice, and long-term partnership.",
  },
  {
    icon: Code2,
    label: "Engineering Philosophy",
    headline: "Quality over shortcuts. Partnership over transactions.",
    body: "We don't ship code we wouldn't put our name on. Every architecture decision, every code review, every deployment is held to the same standard: would we be proud of this in five years?",
  },
];

export function AboutPreviewSection() {
  return (
    <Section background="soft-blue">
      <div className="flex flex-col lg:flex-row items-start gap-16">
        {/* Left: Header */}
        <div className="lg:w-2/5 lg:sticky lg:top-32">
          <SectionHeader
            title="Built on Engineering Discipline"
            subtitle="HawkEdge was founded on a single conviction: that software built with rigour and care outlasts software built fast. That conviction shapes every decision we make."
            centered={false}
            className="mb-8"
          />
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-4 transition-all duration-200"
          >
            Our full story →
          </Link>
        </div>

        {/* Right: Pillars */}
        <div className="flex-1 space-y-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border-color p-8 hover-elevate group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-primary/60 mb-1">{pillar.label}</p>
                    <h3 className="text-lg font-bold font-heading text-secondary mb-3">{pillar.headline}</h3>
                    <p className="text-foreground/65 text-sm leading-relaxed">{pillar.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
