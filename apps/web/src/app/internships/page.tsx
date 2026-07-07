import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@hawkedge/ui';

export const metadata = {
  title: 'Internships | HawkEdge Technology',
  description: 'Apply for the HawkEdge Production Engineering Internship. A rigorous, paid program for developers to contribute to active codebases.',
};

const tracks = [
  {
    title: 'Frontend Engineering',
    tag: 'FE_TRACK',
    syllabus: 'Compile-time type safety in Next.js, accessible component engineering, layout grid execution, performance audits, bundles minimization.',
  },
  {
    title: 'Backend Systems',
    tag: 'BE_TRACK',
    syllabus: 'API architecture design using NestJS, database schema mappings (Prisma/SQL), atomic operations, Redis caching, event queues (Kafka).',
  },
  {
    title: 'Cloud & Infrastructure',
    tag: 'OPS_TRACK',
    syllabus: 'Infrastructure as Code (Terraform), Docker image layers optimization, Kubernetes pods orchestration, Prometheus telemetry configurations.',
  },
];

export default function InternshipsPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 07 / TALENT DEVELOPMENT PIPELINE
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Production Engineering Internship.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            A highly selective, competitive, and paid 6-month pathway for developers who want to escape tutorial hell and build enterprise-grade software.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20">
          <div>
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
              // TRAINING LINES
            </span>
            <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
              Available Tracks
            </h2>
            <p className="text-xs text-text-muted leading-relaxed font-body">
              Interns specialize in one primary technical discipline under the direct mentorship of a senior engineer.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tracks.map((tr, i) => (
              <div key={i} className="border border-border-default p-6 bg-bg-surface/20">
                <span className="font-mono text-[9px] text-brand-primary block mb-2">// {tr.tag}</span>
                <h3 className="font-heading font-bold text-base text-text-primary mb-3">{tr.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-body">{tr.syllabus}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Program Timeline */}
        <div className="border-t border-border-default pt-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            <div>
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
                // SYLLABUS
              </span>
              <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
                The 6-Month Path
              </h2>
              <p className="text-xs text-text-muted leading-relaxed font-body">
                We replace traditional textbook learning with active contribution to production repositories.
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6 font-body text-xs text-text-secondary">
              
              <div className="border border-border-subtle p-5 bg-bg-subtle/50 flex gap-4">
                <span className="font-mono text-sm text-brand-primary font-bold mt-0.5">01-02</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-1">
                    System Foundations & Strict Standards
                  </h3>
                  <p className="leading-relaxed">
                    Learn codebase standards. Enforce strict compiler targets, solve git merge conflicts, and write automated tests. No compiler bypass parameters allowed.
                  </p>
                </div>
              </div>

              <div className="border border-border-subtle p-5 bg-bg-subtle/50 flex gap-4">
                <span className="font-mono text-sm text-brand-primary font-bold mt-0.5">03-04</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-1">
                    Decoupled Feature Execution
                  </h3>
                  <p className="leading-relaxed">
                    Own a decoupled service block. Coordinate API integrations, design schema tables, write unit tests, and submit PRs subject to senior code reviews.
                  </p>
                </div>
              </div>

              <div className="border border-border-subtle p-5 bg-bg-subtle/50 flex gap-4">
                <span className="font-mono text-sm text-brand-primary font-bold mt-0.5">05-06</span>
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-1">
                    Live Production Maintenance & Telemetry
                  </h3>
                  <p className="leading-relaxed">
                    Deploy updates to production pipelines. Inspect Grafana metric logs, resolve real user tickets, and maintain systems under active SLAs.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Admissions FAQ */}
        <div className="border-t border-border-default pt-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            <div>
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
                // ADMISSIONS_PROCESS
              </span>
              <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
                Admissions FAQ
              </h2>
              <p className="text-xs text-text-muted leading-relaxed font-body">
                We accept cohort applications quarterly. Selection is strictly based on performance.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary leading-relaxed font-body">
              
              <div>
                <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-2">
                  Is this a paid program?
                </h3>
                <p>
                  Yes. All accepted interns receive a competitive monthly stipend. We treat interns as junior developers. In return, we expect professional code delivery and commitment.
                </p>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-2">
                  What is the acceptance rate?
                </h3>
                <p>
                  We maintain a strict filter threshold. Historically, our acceptance rate remains below 3% of total code challenges submitted. We values depth and problem-solving drive.
                </p>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-2">
                  Are there full-time conversion opportunities?
                </h3>
                <p>
                  Yes. Over 90% of our production engineers graduated from our internship cohort. Top-performing interns receive a full-time return offer upon completing Month 6.
                </p>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide mb-2">
                  How do I apply?
                </h3>
                <p>
                  Go to our guided contact form, select the &quot;Join Internship&quot; focus query, fill in your details, and attach your public GitHub profile.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="border border-border-default bg-bg-surface p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // APPLICATION_OPEN
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-text-primary mb-4">
            Think You Can Code Production Systems?
          </h2>
          <p className="text-xs text-text-secondary max-w-lg mx-auto mb-6 leading-relaxed font-body">
            Skip the generic resumes. Request an invite coordinates link to complete our active terminal coding challenge.
          </p>
          <Link href="/contact?intent=internship" className="focus:outline-none">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Submit Coordinate Application
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
