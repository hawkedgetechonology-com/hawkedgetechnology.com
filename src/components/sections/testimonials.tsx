import React from "react";
import { Section, SectionHeader } from "@/components/layout/section";
import { Clock, DollarSign, Code2, Headphones } from "lucide-react";

const commitments = [
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We establish realistic timelines during the proposal phase and hold ourselves accountable to them. You'll always know where your project stands.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden costs. No scope creep surprises. Our proposals include full cost breakdowns, and any changes to scope are discussed and agreed upon before work begins.",
  },
  {
    icon: Code2,
    title: "You Own the Code",
    description: "Every line of code we write belongs to you. On project completion, we transfer all intellectual property, source code, and technical documentation — no strings attached.",
  },
  {
    icon: Headphones,
    title: "Post-Launch Support",
    description: "Our relationship doesn't end at deployment. We offer maintenance packages, dedicated support channels, and ongoing development to keep your platform evolving.",
  },
];

export function TestimonialsSection() {
  return (
    <Section background="white">
      <SectionHeader
        title="Our Commitment to Every Client"
        subtitle="These are not aspirational values. They are operational standards we hold ourselves to on every single project we undertake."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commitments.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex gap-6 p-8 rounded-2xl border border-border-color bg-white hover-elevate group"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-xl bg-soft-blue flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon size={22} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-secondary mb-3">
                  {item.title}
                </h3>
                <p className="text-foreground/65 leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
