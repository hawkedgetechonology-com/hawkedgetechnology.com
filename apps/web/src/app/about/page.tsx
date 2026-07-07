import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@hawkedge/ui';

export const metadata = {
  title: 'About | HawkEdge Technology',
  description: 'Learn about our engineering principles, architectural methodology, and why we standardise on zero-debt production software.',
};

export default function AboutPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 01 / CORPORATE LEDGER
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Engineering Systems Without Compromise.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            HawkEdge was founded on a simple thesis: that enterprise software should be built with mathematical rigor and clean architecture out of the gate. We are a team of systems developers, AI engineers, and cloud architects who build software that lasts.
          </p>
        </div>

        {/* Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start mb-20">
          <div>
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
              // METHODOLOGY
            </span>
            <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
              How We Build
            </h2>
            <p className="text-xs text-text-muted leading-relaxed font-body">
              Our engineering lifecycle focuses on eliminating technical debt at every step of the development cycle.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="border border-border-default p-6 bg-bg-surface/30">
              <span className="font-mono text-xs text-text-muted block mb-2">01 / STAGE_AUDIT</span>
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">Strict Schema Auditing</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                We design and validate data models before a single line of application code is written. SQL schema constraints, strict OpenAPI interfaces, and typed protocol buffers prevent runtime exceptions.
              </p>
            </div>

            <div className="border border-border-default p-6 bg-bg-surface/30">
              <span className="font-mono text-xs text-text-muted block mb-2">02 / STAGE_DEVELOPMENT</span>
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">Zero-Debt Standards</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Our codebases enforce strict compiler rules. We disallow compiler bypass flags, require explicit typing, and build reusable UI components based on precise design tokens.
              </p>
            </div>

            <div className="border border-border-default p-6 bg-bg-surface/30">
              <span className="font-mono text-xs text-text-muted block mb-2">03 / STAGE_VALIDATION</span>
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">Automated Telemetry</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                Every commit is automatically analyzed by CI pipelines running linting, formatting, type checking, and unit suites. We monitor code complexity indexes and require 100% core coverage.
              </p>
            </div>

            <div className="border border-border-default p-6 bg-bg-surface/30">
              <span className="font-mono text-xs text-text-muted block mb-2">04 / STAGE_DEPLOYMENT</span>
              <h3 className="font-heading font-bold text-base text-text-primary mb-2">IaC Infrastructure</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                All cloud configurations are written as declarative Terraform modules. We treat server configuration as immutable and automate all rollbacks based on telemetry health thresholds.
              </p>
            </div>

          </div>
        </div>

        {/* Values Section */}
        <div className="border-t border-border-default pt-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            <div>
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
                // ALIGNMENT
              </span>
              <h2 className="font-heading font-bold text-2xl tracking-tight mb-4">
                Our Core Directives
              </h2>
              <p className="text-xs text-text-muted leading-relaxed font-body">
                What drives our team decisions and engineering output day-to-day.
              </p>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="border-l-2 border-brand-primary pl-6 py-2">
                <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Technical Depth Over Sales</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-body">
                  We don&apos;t employ traditional account executives. When you contact HawkEdge, you talk directly to lead architects and systems designers who can discuss code, architecture, and SLA specifics immediately.
                </p>
              </div>

              <div className="border-l-2 border-brand-primary pl-6 py-2">
                <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Continuous Pipeline Vetting</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-body">
                  Through our highly selective student training program, we bring together and train elite technical talent. This constant flow of fresh, vetted energy feeds directly into our engineering delivery pipelines.
                </p>
              </div>

              <div className="border-l-2 border-brand-primary pl-6 py-2">
                <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Complete Client Sovereignty</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-body">
                  Every asset we create—source code repositories, cloud telemetry dashboards, API documentation, design systems, and model weights—is entirely owned by you. We build in the open on clean, documented code.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Global Consult CTA */}
        <div className="border border-border-default bg-bg-surface p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // NEXT PHASE
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-text-primary mb-4">
            Ready to Build With HawkEdge?
          </h2>
          <p className="text-xs text-text-secondary max-w-lg mx-auto mb-6 leading-relaxed font-body">
            Let us inspect your application architecture and draft a roadmap for high-performance scale.
          </p>
          <Link href="/contact" className="focus:outline-none">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Consultation Request
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
