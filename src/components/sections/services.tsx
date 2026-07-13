import React from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Globe, Cpu, Cloud, PenTool, TrendingUp, Settings, Briefcase, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Custom Software Development",
    description: "We design and build proprietary software tailored to your exact operational needs — eliminating inefficiencies and giving you a competitive edge that off-the-shelf products can't match.",
    icon: Monitor,
  },
  {
    title: "Web Application Development",
    description: "Fast, secure, and highly scalable web applications that deliver outstanding user experiences and support long-term business growth — built on proven, modern technology.",
    icon: Globe,
  },
  {
    title: "AI & Intelligent Automation",
    description: "We integrate AI and machine learning into your workflows to automate repetitive tasks, surface actionable insights, and help your team focus on high-value work.",
    icon: Cpu,
  },
  {
    title: "Cloud Infrastructure & DevOps",
    description: "Resilient, cost-optimised cloud architecture with automated deployment pipelines — ensuring your platform is always available, always performant, and always secure.",
    icon: Cloud,
  },
  {
    title: "UI/UX & Product Design",
    description: "User research-led design that converts visitors into customers and keeps users engaged. Every interface we design is purpose-built to achieve your business objectives.",
    icon: PenTool,
  },
  {
    title: "Digital Growth Strategy",
    description: "Data-driven marketing technology and analytics integrations that turn your digital presence into a measurable growth engine for customer acquisition and retention.",
    icon: TrendingUp,
  },
  {
    title: "Business Process Automation",
    description: "End-to-end workflow automation that eliminates manual bottlenecks, reduces operational costs, and frees your team to concentrate on work that drives real business value.",
    icon: Settings,
  },
  {
    title: "Technology Consulting",
    description: "Strategic technology advisory from senior engineers who have shipped complex products. We help you make the right architectural decisions before writing a single line of code.",
    icon: Briefcase,
  },
];

export function ServicesSection() {
  return (
    <Section background="light-gray">
      <SectionHeader
        title="What We Build"
        subtitle="We deliver software that solves real business problems — not just code. Every engagement starts with understanding your goals, not our preferred technology stack."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card key={index} hoverEffect className="group flex flex-col">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-soft-blue flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon size={22} />
                </div>
                <CardTitle className="text-base">{service.title}</CardTitle>
              </CardHeader>
              <CardDescription className="flex-1 text-sm leading-relaxed">
                {service.description}
              </CardDescription>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
              >
                Learn More <ArrowRight size={14} />
              </Link>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
