"use client";

import React, { useEffect, useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/layout/section";
import { Shield, Layers, Lock, Wrench, Headphones, Code2 } from "lucide-react";

const REASONS = [
  {
    icon: Layers,
    title: "Robust Architecture",
    description: "Every system we build is designed from the ground up for reliability, extensibility, and long-term maintainability.",
  },
  {
    icon: Shield,
    title: "Security-First Engineering",
    description: "Security is not an afterthought. We implement industry best practices and compliance standards from day one.",
  },
  {
    icon: Code2,
    title: "Scalable by Design",
    description: "Our infrastructure handles 10x growth without re-engineering. Your platform grows with your business.",
  },
  {
    icon: Wrench,
    title: "Built to Last",
    description: "We write clean, well-documented code that your team can own, extend, and evolve for years to come.",
  },
  {
    icon: Lock,
    title: "Data Integrity & Compliance",
    description: "Enterprise-grade data handling with full audit trails, encryption at rest and in transit, and regulatory compliance.",
  },
  {
    icon: Headphones,
    title: "Long-Term Partnership",
    description: "We don't disappear after launch. We remain your engineering partner for support, updates, and future growth.",
  },
];

const STATS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 5, suffix: "+", label: "Years of Excellence" },
  { value: 20, suffix: "+", label: "Technologies Mastered" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function WhyHawkEdgeSection() {
  return (
    <Section background="white">
      <SectionHeader
        title="Why Clients Choose HawkEdge"
        subtitle="We combine engineering discipline with business acumen to deliver software that doesn't just work — it performs, scales, and lasts."
      />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {REASONS.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-border-color bg-white hover-elevate transition-all duration-300 hover:border-primary/20"
            >
              <div className="w-12 h-12 rounded-xl bg-soft-blue flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold font-heading text-secondary mb-3">
                {reason.title}
              </h3>
              <p className="text-foreground/65 leading-relaxed text-sm">
                {reason.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Animated Stats Bar */}
      <div className="bg-secondary rounded-2xl p-10 md:p-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center md:px-8 py-4 md:py-0">
              <div className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm font-medium text-white/60 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
