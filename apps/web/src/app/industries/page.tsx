import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Activity, BarChart2, GraduationCap, Server } from 'lucide-react';
import { Button } from '@hawkedge/ui';

export const metadata = {
  title: 'Industries | HawkEdge Technology',
  description: 'Precision systems engineering and AI integrations tailored for logistics, healthcare, fintech, edtech, and enterprise SaaS sectors.',
};

const industries = [
  {
    icon: Server,
    title: 'Logistics & Supply Chain',
    tagline: 'OPERATIONAL CAPACITY & ROUTING',
    problems: 'Vehicle routing optimization, warehouse inventory forecasting, legacy ERP sync, real-time fleet telemetry.',
    solution: 'We build high-concurrency scheduling software and RAG forecasting models that reduce fuel burn and warehouse bloat. Standardized on Go and AWS.',
  },
  {
    icon: Activity,
    title: 'Healthcare & Clinical Systems',
    tagline: 'SECURE PATIENT RECORD FLOW',
    problems: 'Physician drafting workloads, EHR system bottlenecks, HIPAA compliance parameters, medical audio processing.',
    solution: 'We construct isolated clinical documenters utilizing Whisper speech-to-text models. Deployed behind secure VPN networks with full logging audits.',
  },
  {
    icon: BarChart2,
    title: 'Fintech & Transaction Processing',
    tagline: 'HIGH-FREQUENCY ORDER PIPELINES',
    problems: 'Monolith database write deadlocks, fraud log analysis, real-time ledger updates, sub-second latency targets.',
    solution: 'We deconstruct transaction monoliths into Go APIs backed by partitioned Apache Kafka queues, shifting read-heavy loads to memory indexes.',
  },
  {
    icon: GraduationCap,
    title: 'EdTech & Learning Platforms',
    tagline: 'AUTOMATED EVALUATORS & MONOREPOS',
    problems: 'Manual student grading bottlenecks, code compilation scaling, compiler sandbox security, user telemetry.',
    solution: 'We engineer sandboxed execution compilers that grade developer submissions against code quality, linting, and verification checklists.',
  },
  {
    icon: Shield,
    title: 'Enterprise SaaS Platforms',
    tagline: 'ZERO-DEBT TENANT ARCHITECTURES',
    problems: 'Multi-tenant database isolation, slow page loading, complex permission systems, high maintenance overhead.',
    solution: 'We structure Next.js and NestJS monorepos, enforcing strict compiler rules, clean DB schemas, and automated Canary deployment pipelines.',
  },
];

export default function IndustriesPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 05 / OPERATIONAL DOMAINS
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Sectors We Serve.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            We do not build generic software. We engineer domain-specific digital systems optimized to resolve the unique bottlenecks of complex operational sectors.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div
                key={i}
                className="border border-border-default bg-bg-surface/20 p-6 flex flex-col justify-between hover:border-border-strong transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 border border-border-subtle bg-bg-subtle rounded-sm">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">
                      {ind.tagline}
                    </span>
                  </div>

                  <h2 className="font-heading font-bold text-xl text-text-primary mb-4">
                    {ind.title}
                  </h2>

                  <div className="flex flex-col gap-4 text-xs font-body mb-6">
                    <div>
                      <span className="font-mono text-[9px] text-brand-primary block mb-1">
                        COMMON BOTTLENECK:
                      </span>
                      <p className="text-text-muted leading-relaxed">
                        {ind.problems}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-text-secondary block mb-1">
                        OUR SYSTEM APPROACH:
                      </span>
                      <p className="text-text-secondary leading-relaxed">
                        {ind.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="font-mono text-xs text-brand-primary hover:text-text-primary flex items-center gap-1.5 pt-4 border-t border-border-subtle/50 mt-4 focus:outline-none"
                >
                  Consult on this domain <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="border border-border-default bg-bg-surface p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // CORE DESIGN
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-text-primary mb-4">
            Deploy an Custom Architecture Block
          </h2>
          <p className="text-xs text-text-secondary max-w-lg mx-auto mb-6 leading-relaxed font-body">
            Reach out to our engineering lead to discuss system specifications, schemas, compliance needs, and timelines.
          </p>
          <Link href="/contact" className="focus:outline-none">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Initiate Domain Consult
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
