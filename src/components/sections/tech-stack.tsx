import React from "react";
import { Section, SectionHeader } from "@/components/layout/section";

const techCategories = [
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Backend",
    skills: ["Node.js", "Python", "Go", "PostgreSQL"],
  },
  {
    name: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    name: "Design & UI/UX",
    skills: ["Figma", "Framer", "Design Systems", "Prototyping"],
  },
];

export function TechStackSection() {
  return (
    <Section background="soft-blue">
      <SectionHeader 
        title="Modern Technology Stack" 
        subtitle="We utilize industry-leading tools and frameworks to build software that is secure, scalable, and future-proof."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {techCategories.map((category, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl border border-border-color shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold font-heading text-secondary mb-6">{category.name}</h3>
            <ul className="space-y-4">
              {category.skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground/80 font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
