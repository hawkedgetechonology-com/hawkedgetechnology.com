import React from "react";
import { Section } from "@/components/layout/section";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Section background="soft-blue" className="pt-40 pb-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-40 -skew-x-12 translate-x-32" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-secondary mb-6 tracking-tight animate-fade-in">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-foreground/70 leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
            {subtitle}
          </p>
        )}
      </div>
    </Section>
  );
}
