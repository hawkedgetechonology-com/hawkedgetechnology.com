'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, RefreshCw, Download, FileText,
  Building2, Calendar, ChevronRight, Clock, AlertTriangle,
} from 'lucide-react';

interface ProposalSection {
  projectUnderstanding?: string;
  scopeOfWork?: string;
  deliverables?: string;
  techStack?: string;
  timeline?: string;
  teamStructure?: string;
  assumptions?: string;
  exclusions?: string;
  support?: string;
  terms?: string;
  acceptance?: string;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  currentVersion: number;
  createdAt: string;
  sections: ProposalSection;
  lead: {
    fullName: string;
    companyName: string;
    email: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  SENT: 'bg-indigo-900/40 text-indigo-300 border-indigo-700',
  ACCEPTED: 'bg-green-900/40 text-green-300 border-green-700',
  REJECTED: 'bg-red-900/40 text-red-300 border-red-700',
  ARCHIVED: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
};

const SECTIONS_META = [
  { key: 'projectUnderstanding', label: '01. Project Understanding' },
  { key: 'scopeOfWork', label: '02. Scope of Work' },
  { key: 'deliverables', label: '03. Deliverables & Milestones' },
  { key: 'techStack', label: '04. Technology Stack' },
  { key: 'timeline', label: '05. Project Timeline' },
  { key: 'teamStructure', label: '06. Team Structure' },
  { key: 'assumptions', label: '07. Assumptions' },
  { key: 'exclusions', label: '08. Exclusions' },
  { key: 'support', label: '09. Support & Maintenance' },
  { key: 'terms', label: '10. Terms & Conditions' },
  { key: 'acceptance', label: '11. Acceptance' },
];

function ProposalPortalContent({ id }: { id: string }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [actionState, setActionState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisionComment, setRevisionComment] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProposal(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const performAction = async (type: 'accept' | 'reject' | 'revise') => {
    if (!proposal) return;
    setActionState('loading');

    try {
      if (type === 'revise') {
        await fetch(`/api/proposals/${id}/revise`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments: revisionComment }),
        });
        setActionMessage('Revision request logged. Our team will be in touch shortly.');
      } else {
        await fetch(`/api/proposals/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: type === 'accept' ? 'ACCEPTED' : 'REJECTED' }),
        });
        setActionMessage(
          type === 'accept'
            ? 'Proposal accepted! Your workspace and project environment are being provisioned. Check your email for credentials.'
            : 'Proposal declined. We have noted your decision and will reach out to discuss next steps.',
        );
      }
      setActionState('success');
      // Refresh proposal state
      const updated = await fetch(`/api/proposals/${id}`).then((r) => r.json());
      setProposal(updated);
    } catch {
      setActionState('error');
      setActionMessage('An error occurred. Please try again or contact support.');
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-base text-text-muted min-h-screen flex items-center justify-center font-mono text-xs">
        <span>// LOADING PROPOSAL COORDINATES...</span>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="bg-bg-base text-text-primary min-h-screen flex items-center justify-center font-mono text-sm">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
          <p>Proposal not found or access denied.</p>
        </div>
      </div>
    );
  }

  const sections = proposal.sections || {};
  const isActionable = proposal.status === 'SENT';

  return (
    <div className="bg-bg-base text-text-primary min-h-screen font-body">
      {/* Top bar */}
      <div className="border-b border-border-default bg-bg-surface/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-brand-primary" />
          <span className="font-heading font-bold text-sm tracking-tight">HAWKEDGE ENGINEERING</span>
          <span className="font-mono text-xs text-text-muted">// CLIENT PORTAL</span>
        </div>
        <a
          href={`/api/proposals/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-border-default text-xs font-mono text-text-secondary hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          <Download className="w-3 h-3" />
          DOWNLOAD_PDF
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-1">
            <div className="mb-6 p-4 border border-border-default bg-bg-surface/30">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-brand-primary" />
                <span className="font-mono text-xs text-brand-primary uppercase">Client Brief</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">{proposal.lead.companyName}</p>
              <p className="text-xs text-text-muted">{proposal.lead.fullName}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-[9px] font-mono font-bold px-2 py-1 border ${STATUS_COLORS[proposal.status] || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                  {proposal.status}
                </span>
                <span className="text-[9px] text-text-muted font-mono">v{proposal.currentVersion}</span>
              </div>
            </div>
            {SECTIONS_META.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(i)}
                className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors border-l-2 ${
                  activeSection === i
                    ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="border-b border-border-default pb-8 mb-10">
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
              // PROJECT PROPOSAL
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary mb-2">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-mono mt-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(proposal.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Version {proposal.currentVersion}
              </span>
            </div>
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <span className="font-mono text-xs text-brand-primary uppercase tracking-widest">
                  {SECTIONS_META[activeSection]?.label}
                </span>
              </div>
              <div className="bg-bg-surface/30 border border-border-default p-6">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {(sections as Record<string, string>)[SECTIONS_META[activeSection]?.key ?? ''] || 'Section not yet populated. Contact the HawkEdge team for details.'}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className="px-4 py-2 text-xs font-mono border border-border-default text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
                >
                  ← PREV
                </button>
                {activeSection < SECTIONS_META.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(activeSection + 1)}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-mono border border-brand-primary text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    NEXT <ChevronRight className="w-3 h-3" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Panel */}
          {isActionable && actionState !== 'success' && (
            <div className="mt-12 border border-border-default bg-bg-surface/20 p-6">
              <span className="font-mono text-xs text-brand-primary uppercase tracking-widest block mb-4">
                // CLIENT DECISION PANEL
              </span>

              {!revisionMode ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => performAction('accept')}
                    disabled={actionState === 'loading'}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-mono font-bold transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    ACCEPT_PROPOSAL
                  </button>
                  <button
                    onClick={() => performAction('reject')}
                    disabled={actionState === 'loading'}
                    className="flex items-center gap-2 px-6 py-3 border border-red-700 text-red-400 hover:bg-red-900/20 text-xs font-mono transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    DECLINE_PROPOSAL
                  </button>
                  <button
                    onClick={() => setRevisionMode(true)}
                    className="flex items-center gap-2 px-6 py-3 border border-border-default text-text-muted hover:text-text-primary text-xs font-mono transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    REQUEST_REVISION
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="font-mono text-xs text-text-muted block">
                    Describe the changes you need:
                  </label>
                  <textarea
                    value={revisionComment}
                    onChange={(e) => setRevisionComment(e.target.value)}
                    rows={4}
                    className="w-full bg-bg-surface border border-border-default text-text-primary text-xs font-mono p-3 focus:outline-none focus:border-brand-primary resize-none"
                    placeholder="// e.g. Please extend the timeline to 20 weeks and add GraphQL to the tech stack..."
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => performAction('revise')}
                      disabled={!revisionComment.trim() || actionState === 'loading'}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono disabled:opacity-50 transition-colors"
                    >
                      SUBMIT_REVISION_REQUEST
                    </button>
                    <button
                      onClick={() => setRevisionMode(false)}
                      className="px-5 py-2 border border-border-default text-text-muted text-xs font-mono hover:text-text-primary transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Result */}
          {actionState === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-12 border p-6 ${
                proposal.status === 'ACCEPTED'
                  ? 'border-green-700 bg-green-900/10'
                  : 'border-border-default bg-bg-surface/20'
              }`}
            >
              <p className="text-sm text-text-secondary font-body">{actionMessage}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProposalPortalPage() {
  const params = useParams<{ id: string }>();
  return (
    <Suspense fallback={
      <div className="bg-bg-base text-text-muted min-h-screen flex items-center justify-center font-mono text-xs">
        // LOADING PROPOSAL COORDINATES...
      </div>
    }>
      <ProposalPortalContent id={params.id} />
    </Suspense>
  );
}
