import React from "react";
import { Section, SectionHeader } from "@/components/layout/section";
import { Search, Phone, FileText, Code2, TestTube2, Rocket, Headphones } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Discovery",
    desc: "We conduct a structured discovery session to understand your business, users, technical constraints, and success criteria. This forms the foundation of everything we build.",
    icon: Search,
  },
  {
    id: "02",
    title: "Consultation",
    desc: "Our senior engineers and strategists align on the right technical approach. We challenge assumptions and validate feasibility before committing to a direction.",
    icon: Phone,
  },
  {
    id: "03",
    title: "Proposal",
    desc: "You receive a detailed, transparent proposal: scope, timeline, cost breakdown, and technology plan. No surprises. No vague estimates.",
    icon: FileText,
  },
  {
    id: "04",
    title: "Development",
    desc: "Iterative development with regular check-ins. You see real progress every sprint. Our code reviews, architecture standards, and CI/CD pipelines ensure quality at every step.",
    icon: Code2,
  },
  {
    id: "05",
    title: "Testing",
    desc: "Rigorous quality assurance — automated tests, performance benchmarks, security audits, and accessibility checks. We don't ship code we wouldn't use ourselves.",
    icon: TestTube2,
  },
  {
    id: "06",
    title: "Deployment",
    desc: "Seamless, zero-downtime deployment with monitoring and rollback capabilities. Your transition to production is planned, rehearsed, and executed without disruption.",
    icon: Rocket,
  },
  {
    id: "07",
    title: "Support",
    desc: "Ongoing maintenance, performance monitoring, security updates, and dedicated support. We remain your engineering partner long after launch.",
    icon: Headphones,
  },
];

export function ProcessSection() {
  return (
    <Section background="white">
      <SectionHeader
        title="How We Work"
        subtitle="A structured, transparent process that eliminates uncertainty and keeps every project on track — from first conversation to long-term support."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-7 top-0 bottom-0 w-px bg-border-color" />

        <div className="space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.id} className="relative flex gap-8 group">
                {/* Node */}
                <div className="relative z-10 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-border-color group-hover:border-primary flex items-center justify-center transition-colors duration-300 shadow-sm">
                    <Icon size={20} className="text-secondary group-hover:text-primary transition-colors duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className={`pb-10 flex-1 ${isLast ? "" : ""}`}>
                  <div className="flex items-center gap-3 mb-2 pt-3">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary/60">{step.id}</span>
                    <h3 className="text-xl font-bold font-heading text-secondary">{step.title}</h3>
                  </div>
                  <p className="text-foreground/65 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance note */}
        <div className="mt-4 ml-22 pl-8 border-l-2 border-primary/20">
          <p className="text-sm text-foreground/60 italic">
            Every HawkEdge project follows this structured workflow — no surprises, no shortcuts, no exceptions.
          </p>
        </div>
      </div>
    </Section>
  );
}
