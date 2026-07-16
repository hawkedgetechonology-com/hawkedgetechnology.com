import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Nexus Fleet — Logistics Intelligence Platform",
    category: "Enterprise Software",
    categoryColor: "text-primary",
    challenge: "A mid-size logistics operator was managing 400+ daily routes using spreadsheets and disconnected tools, leading to costly delays and no real-time visibility.",
    solution: "HawkEdge designed and built a unified fleet intelligence platform with live GPS tracking, automated dispatch, predictive ETA modelling, and a driver mobile app.",
    technology: ["Next.js", "NestJS", "PostgreSQL", "Redis", "AWS", "React Native"],
    impact: "Reduced average route delays by 34%, cut fuel waste by 18%, and eliminated 6 hours of daily manual reconciliation work.",
    accentColor: "#00A3FF",
    imageUrl: "/nexus_fleet_mockup.png",
  },
  {
    title: "Finova Wealth — Client Portal & CRM",
    category: "FinTech",
    categoryColor: "text-secondary",
    challenge: "A wealth management firm with 800+ high-net-worth clients was relying on generic CRM software that failed compliance requirements and couldn't handle complex portfolio reporting.",
    solution: "A bespoke client portal and relationship management system with role-based access, automated regulatory reporting, client document vault, and integrated advisory scheduling.",
    technology: ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript", "AWS"],
    impact: "Achieved full GDPR and MiFID II compliance, reduced client onboarding time from 5 days to 6 hours, and improved advisor productivity by 40%.",
    accentColor: "#004385",
    imageUrl: "/finova_wealth_mockup.png",
  },
  {
    title: "MedBridge — Healthcare Coordination System",
    category: "HealthTech",
    categoryColor: "text-primary",
    challenge: "A regional healthcare provider was coordinating patient referrals, specialist bookings, and care plans across 12 facilities entirely through phone calls and email threads.",
    solution: "A HIPAA-compliant care coordination platform enabling secure messaging, digital referral workflows, shared care plans, and real-time appointment management across all facilities.",
    technology: ["Next.js", "NestJS", "PostgreSQL", "Redis", "TypeScript", "AWS"],
    impact: "Reduced referral completion time by 61%, decreased missed appointments by 28%, and gave care teams a single source of truth for patient journeys.",
    accentColor: "#00A3FF",
    imageUrl: "/medbridge_healthcare_mockup.png",
  },
];

function CaseStudyVisual({ project }: { project: typeof projects[0] }) {
  return (
    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative border border-border-color shadow-sm hover:shadow-md transition-shadow duration-300 bg-light-gray flex items-center justify-center">
      <div className="relative w-full h-full">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

export function PortfolioSection() {
  return (
    <Section background="light-gray">
      <SectionHeader
        title="Case Studies"
        subtitle="Real problems. Real solutions. Real results. A selection of the complex challenges we've solved for clients across industries."
      />

      <div className="space-y-8 mb-12">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-border-color shadow-sm hover-elevate overflow-hidden"
          >
            <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
              {/* Visual */}
              <div className="lg:w-2/5 p-8 flex items-center justify-center bg-light-gray border-b lg:border-b-0 lg:border-r border-border-color">
                <CaseStudyVisual project={project} />
              </div>

              {/* Content */}
              <div className="flex-1 p-8 lg:p-10">
                <span className={`text-xs font-bold uppercase tracking-widest ${project.categoryColor} mb-3 block`}>
                  {project.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-heading text-secondary mb-6">
                  {project.title}
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-1">Challenge</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">{project.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-1">Solution</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">{project.solution}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-1">Business Impact</p>
                    <p className="text-sm font-medium text-secondary leading-relaxed">{project.impact}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-soft-blue text-xs font-semibold text-secondary rounded-full border border-border-color"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/portfolio">
          <Button variant="outline" size="lg" className="hover-elevate gap-2">
            View Full Portfolio <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </Section>
  );
}
