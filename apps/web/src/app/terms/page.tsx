import React from 'react';

export const metadata = {
  title: 'Terms of Service | HawkEdge Technology',
  description: 'Read the terms of service governing software engineering agreements, intellectual property transfer, and liability limits.',
};

export default function TermsPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-border-default pb-8 mb-12">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // DOCUMENT CODENAME: TERMS_CONDITIONS_LEDGER
          </span>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
            Terms of Service
          </h1>
          <p className="text-xs text-text-muted mt-2 font-mono">
            LAST UPDATE RECORDED: JULY 05, 2026 // VERSION 1.0.0
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 text-xs text-text-secondary leading-relaxed font-body">
          
          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              1. BINDING COORDINATES (AGREEMENT TO TERMS)
            </h2>
            <p>
              By accessing this public site or initiating a project consult ticket, you agree to comply with these Terms of Service. If you are entering into a specific software design agreement, the parameters outlined in your signed Statement of Work (SOW) will supersede this document.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              2. PROFESSIONAL SCOPE & DELIVERABLES
            </h2>
            <p>
              HawkEdge provides systems engineering, AI validation pipelines, and cloud native infrastructure deployments as professional consulting deliverables. We warrant that all code created meets strict linter parameters, achieves compile-time checks, and matches the technical roadmap defined in the applicable SOW.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              3. INTELLECTUAL PROPERTY & TRANSFER CODE
            </h2>
            <p>
              Upon complete clearance of all invoice payment blocks corresponding to a Statement of Work, HawkEdge irrevocably transfers 100% of all code copyrights, database schemas, repository files, design vectors, and API blueprints created under that SOW to the Client.
            </p>
            <p className="mt-3">
              Any pre-existing open-source dependencies or shared packages compiled by HawkEdge remain licensed under their respective copyright authorities (e.g. MIT, Apache 2.0).
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              4. LIMITATION OF LIABILITY CODES
            </h2>
            <p>
              To the maximum extent permitted by applicable laws, HawkEdge Technology Private Limited shall not be liable for any indirect, incidental, or consequential system failures (including server downtimes, database locks, security breaches, or data losses).
            </p>
            <p className="mt-3 font-bold text-text-primary">
              HawkEdge&apos;s total cumulative liability for any claim arising out of a specific development engagement shall be strictly capped at the total amount paid by the Client under the active SOW directly responsible for the claim during the preceding 6-month interval.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              5. JURISDICTION
            </h2>
            <p>
              These terms are governed by the laws of India. Any litigation coordinates arising out of services provided shall be resolved exclusively within the competent courts of Bengaluru, Karnataka, India.
            </p>
          </section>

          <section className="border-t border-border-subtle pt-8 mt-4 font-mono text-[10px] text-text-muted">
            <p>
              For inquiries regarding terms, licensing codes, or corporate registers, submit a contact ticket referencing system ID: <strong>TERMS-COMPLIANCE-AUDIT</strong> or email <a href="mailto:ops@hawkedge.io" className="text-brand-primary underline hover:text-text-primary">ops@hawkedge.io</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
