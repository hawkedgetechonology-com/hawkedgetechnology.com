import React from "react";

const TECHNOLOGIES = [
  "Next.js",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "TypeScript",
  "React",
  "Kubernetes",
  "Terraform",
];

// Duplicate for seamless infinite scroll
const ALL_TECHS = [...TECHNOLOGIES, ...TECHNOLOGIES];

export function TrustBarSection() {
  return (
    <section className="py-8 bg-white border-y border-border-color overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40">
          Built With Enterprise-Grade Technology
        </p>
      </div>

      {/* Scrolling badges */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }} />

        <div className="flex trust-scroll-track" style={{ width: "max-content" }}>
          {ALL_TECHS.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mx-4 px-5 py-2.5 rounded-full border border-border-color bg-light-gray hover:border-secondary/30 hover:bg-soft-blue transition-all duration-200 cursor-default shrink-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-semibold text-secondary tracking-wide whitespace-nowrap">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
