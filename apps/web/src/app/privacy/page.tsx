import React from 'react';

export const metadata = {
  title: 'Privacy Policy | HawkEdge Technology',
  description: 'Read the privacy ledger outlining information coordinates collection, encryption parameters, and data retention standards.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-border-default pb-8 mb-12">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // DOCUMENT CODENAME: PRIVACY_LEDGER
          </span>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
            Privacy Policy
          </h1>
          <p className="text-xs text-text-muted mt-2 font-mono">
            LAST UPDATE RECORDED: JULY 05, 2026 // VERSION 1.0.0
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 text-xs text-text-secondary leading-relaxed font-body">
          
          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              1. COORDINATES INGESTION (WHAT WE COLLECT)
            </h2>
            <p className="mb-4">
              HawkEdge Technology collects and logs data coordinates to execute consulting reviews and maintain system parameters. This includes:
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Client Identity Parameters:</strong> Name, work email address, company registration, billing targets.
              </li>
              <li>
                <strong>System Specifications:</strong> Architecture blueprints, codebase paths, schema descriptions, database logs shared during consultations.
              </li>
              <li>
                <strong>Web telemetry logs:</strong> Client IP address, browser metadata, page latency, and navigation metrics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              2. PROCESSING LAWS (HOW WE USE DATA)
            </h2>
            <p>
              Your data parameters are strictly utilized to:
            </p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li>Formulate and evaluate technical systems architecture proposals.</li>
              <li>Compile and debug custom software codebases within private repository blocks.</li>
              <li>Analyze web latency parameters to hit our Lighthouse performance targets.</li>
              <li>Fulfill professional compliance records under applicable tax laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              3. COMPARTMENTALIZATION & SECURITY (HOW WE SECURE DATA)
            </h2>
            <p className="mb-3">
              We treat software blueprints as confidential assets.
            </p>
            <p className="mb-3">
              All communications are encrypted in transit using TLS 1.3 and at rest using AES-256 standard database files. Code repositories are isolated on secure virtual private networks (VPNs) and multi-factor authentication (MFA) parameters are mandatory across all staff credentials.
            </p>
            <p>
              <strong>Data Sovereignty Warning:</strong> HawkEdge does not transmit private source code or model weights to public third-party generative artificial intelligence APIs unless explicitly requested and approved by the client in writing.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              4. RETENTION & DELETION LEDGER
            </h2>
            <p>
              Client records are stored for the duration of the engagement block. Upon project termination or client request, we execute a complete, immutable purge of all client code files and server blueprints from our staging instances within 30 days, retaining only legally required invoices.
            </p>
          </section>

          <section className="border-t border-border-subtle pt-8 mt-4 font-mono text-[10px] text-text-muted">
            <p>
              For inquiries regarding data coordinates or deletion logs, submit a contact ticket referencing system ID: <strong>PRIVACY-SECURE-AUDIT</strong> or write directly to <a href="mailto:ops@hawkedge.io" className="text-brand-primary underline hover:text-text-primary">ops@hawkedge.io</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
