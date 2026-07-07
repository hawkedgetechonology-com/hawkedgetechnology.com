import React from 'react';

export const metadata = {
  title: 'Refund & Cancellation Policy | HawkEdge Technology',
  description: 'Review the refund and project cancellation parameters governing our engineering cycles and sprint milestones.',
};

export default function RefundPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-border-default pb-8 mb-12">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // DOCUMENT CODENAME: REFUND_CANCELLATION_LEDGER
          </span>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-text-muted mt-2 font-mono">
            LAST UPDATE RECORDED: JULY 05, 2026 // VERSION 1.0.0
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 text-xs text-text-secondary leading-relaxed font-body">
          
          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              1. SPRINT BLOCK BILLING STRUCTURE
            </h2>
            <p>
              HawkEdge operates on a strict milestone-based sprint billing methodology. Project scopes are divided into sequential sprint milestones (typically 2-week intervals) defined in your Statement of Work (SOW). Payment for each milestone block is required prior to the commencement of that specific engineering cycle.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              2. REFUND ELIGIBILITY PARAMETERS
            </h2>
            <p className="mb-3">
              Because sprint cycles involve dedicated allocations of senior developer hours and cloud hosting compute configurations:
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <strong>Completed Sprint Milestones:</strong> Once a sprint milestone has been compiled, reviewed, and deployed to staging or repository handoff, all fees paid for that block are 100% non-refundable.
              </li>
              <li>
                <strong>Pre-Paid Unstarted Sprints:</strong> If a client terminates an engagement prior to the start of a subsequent milestone block, any pre-paid funds allocated to that unstarted block are eligible for a 100% refund.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              3. PROJECT CANCELLATION PROTOCOLS
            </h2>
            <p>
              Either party may terminate an active software development agreement by providing a 15-day written notice to the designated system email coordinate. Upon receiving a cancellation ticket:
            </p>
            <ul className="list-disc pl-4 space-y-2 mt-2">
              <li>HawkEdge will halt all development commits at the boundary of the current active sprint block.</li>
              <li>All completed source code and documentation compiled up to that point will be pushed to the client repository.</li>
              <li>Any unspent advance balances will be refunded within 10 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide mb-3">
              4. RESOLUTION TIMELINE
            </h2>
            <p>
              Refund processing runs within 10 business days following the verification of account closures. Refunds are returned exclusively via bank transfer parameters to the original corporate bank account coordinates.
            </p>
          </section>

          <section className="border-t border-border-subtle pt-8 mt-4 font-mono text-[10px] text-text-muted">
            <p>
              To initiate a project cancellation or refund query, submit a ticket referencing system ID: <strong>REFUND-BILLING-AUDIT</strong> or contact billing coordinates at <a href="mailto:ops@hawkedge.io" className="text-brand-primary underline hover:text-text-primary">ops@hawkedge.io</a>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
