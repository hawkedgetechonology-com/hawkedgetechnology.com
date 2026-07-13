"use client";

import React, { useState } from "react";
import { Section, SectionHeader } from "@/components/layout/section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What does the consultation process look like?",
    answer: "Our free consultation is a 30-minute discovery call with one of our senior engineers. We ask structured questions about your business goals, current challenges, and technical context. You receive a written summary and initial recommendations within 48 hours — with no obligation to proceed.",
  },
  {
    question: "How transparent is your pricing?",
    answer: "Completely transparent. After discovery, you receive a detailed proposal with a full cost breakdown: development hours, infrastructure costs, and any third-party licensing. Nothing is hidden. If the scope changes, we discuss and agree on any cost implications before we act on them.",
  },
  {
    question: "Do you sign NDAs?",
    answer: "Yes, always. We treat client confidentiality as a baseline requirement, not a negotiation point. Our standard engagement includes a mutual NDA before we discuss any sensitive details about your product or business.",
  },
  {
    question: "What industries do you specialise in?",
    answer: "We work across industries including logistics, financial services, healthcare, professional services, and e-commerce. Our engineering approach is sector-agnostic, but we bring specific compliance and domain experience to regulated industries such as finance and healthcare.",
  },
  {
    question: "What is a realistic project timeline?",
    answer: "A well-scoped web application typically takes 8–12 weeks from kickoff to launch. Complex enterprise platforms with multiple integrations can run 4–8 months. We provide realistic timelines during the proposal phase — not optimistic ones we can't honour.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes. We offer structured maintenance and support packages that include performance monitoring, security patching, bug fixes, and access to a dedicated support channel. Ongoing development retainers are also available for clients who need regular feature delivery.",
  },
  {
    question: "Who owns the code and intellectual property?",
    answer: "You do. Upon project completion and final payment, all source code, assets, and technical documentation are transferred to you in full. We retain no rights or licences to your product. It belongs to you entirely.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section background="light-gray">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Straightforward answers to the questions clients ask most before engaging with HawkEdge."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "bg-white border rounded-2xl overflow-hidden transition-all duration-300",
                isOpen ? "border-primary/20 shadow-sm" : "border-border-color"
              )}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                id={`faq-${index}`}
                aria-expanded={isOpen}
              >
                <span className={cn(
                  "text-base font-semibold font-heading transition-colors duration-200 pr-4",
                  isOpen ? "text-primary" : "text-secondary"
                )}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "text-foreground/40 transition-transform duration-300 shrink-0",
                    isOpen && "rotate-180 text-primary"
                  )}
                  size={18}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-6 text-foreground/65 leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
