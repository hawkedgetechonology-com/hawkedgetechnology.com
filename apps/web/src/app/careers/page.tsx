import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '@hawkedge/ui';

export const metadata = {
  title: 'Careers | HawkEdge Technology',
  description: 'Join the HawkEdge engineering team. View open senior architectural and engineering roles.',
};

const openRoles = [
  {
    title: 'Senior Frontend Architect',
    id: 'ROLE-FE-001',
    discipline: 'Frontend Engineering',
    location: 'Bengaluru / Hybrid',
    description: 'Lead the architecture of Next.js monorepos, design systems tokens integration, and performance benchmarking.',
    requirements: [
      '5+ years experience building complex React and Next.js applications.',
      'Expert knowledge of rendering strategies (ISR, SSR, hydration).',
      'Proven track record achieving 95+ performance metrics on complex pages.',
    ],
  },
  {
    title: 'Backend Systems Engineer',
    id: 'ROLE-BE-002',
    discipline: 'Backend Engineering',
    location: 'Bengaluru / Hybrid',
    description: 'Construct high-throughput Go and NestJS APIs, design relational database schemas, and integrate event streaming channels.',
    requirements: [
      '4+ years programming in Go or structured Node.js (NestJS).',
      'Deep understanding of PostgreSQL isolation levels, query analysis, and index tuning.',
      'Experience with message queue brokers (Kafka, RabbitMQ, or Redis Streams).',
    ],
  },
  {
    title: 'DevOps & Infrastructure Lead',
    id: 'ROLE-OPS-003',
    discipline: 'Cloud Operations & IaC',
    location: 'Remote / India',
    description: 'Define and maintain multi-region cloud infrastructures in Terraform, oversee build containers, and set up alert metrics.',
    requirements: [
      '5+ years managing AWS or Google Cloud infrastructures via Terraform IaC.',
      'Production experience orchestration workloads on Kubernetes or AWS ECS.',
      'Proficiency writing secure CI/CD build scripts in GitHub Actions or GitLab.',
    ],
  },
];

export default function CareersPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 08 / HUMAN CAPITAL INDEX
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Join the Engineering Guild.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            We don&apos;t have ping-pong tables or slide decks. We have deep technical puzzles, direct code reviews, complete repository autonomy, and senior developers who take pride in crafting software.
          </p>
        </div>

        {/* Culture / Alignment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start mb-20">
          <div>
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
              // OPERATIONS PHILOSOPHY
            </span>
            <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
              Our Culture Directives
            </h2>
            <p className="text-xs text-text-muted leading-relaxed font-body">
              How we cooperate as a technical organization.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary font-body">
            
            <div className="border border-border-default p-6 bg-bg-surface/20">
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">Asynchronous & Documented</h3>
              <p className="leading-relaxed">
                We write clear specifications in markdown before coding features. We respect uninterrupted execution time blocks and keep status alignment meetings under 15 minutes.
              </p>
            </div>

            <div className="border border-border-default p-6 bg-bg-surface/20">
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">Zero-Fluff Feedback</h3>
              <p className="leading-relaxed">
                We review code objectively. Pull requests are scrutinized for performance, memory allocations, complexity levels, and schema safety. We target excellence in execution.
              </p>
            </div>

          </div>
        </div>

        {/* Open Postings */}
        <div className="border-t border-border-default pt-16 mb-20">
          <div className="flex items-center gap-2 mb-12">
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase">// OPEN POSITION LEDGER</span>
          </div>

          <div className="flex flex-col gap-8">
            {openRoles.map((role) => (
              <div
                key={role.id}
                className="border border-border-default bg-bg-surface/10 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-4 border-b border-border-subtle pb-3 font-mono text-[10px] text-text-muted">
                    <span>ID: {role.id} // {role.discipline.toUpperCase()}</span>
                    <span>LOCATION: {role.location.toUpperCase()}</span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-text-primary mb-3">
                    {role.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6 font-body">
                    {role.description}
                  </p>

                  <div className="mb-6 font-body">
                    <span className="font-mono text-[9px] text-brand-primary uppercase block mb-2">
                      CORE REQUIREMENTS:
                    </span>
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary">
                      {role.requirements.map((req, idx) => (
                        <li key={idx} className="leading-relaxed">{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-subtle">
                  <Link href={`/contact?role=${role.id}`} className="focus:outline-none">
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Request Role Coordinates
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Application */}
        <div className="border border-border-default bg-bg-surface p-6 sm:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <Terminal className="w-10 h-10 text-brand-primary flex-shrink-0" />
          <div>
            <h3 className="font-heading font-bold text-base text-text-primary mb-1">General Code Registry</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-body">
              Don&apos;t see a matching position ledger code? If you are a senior systems engineer or AI researcher, contact us with your public commits history and resume parameters.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
