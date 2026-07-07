'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Plus, Send, Archive, Copy, ChevronDown,
  ChevronRight, Search, Filter, ExternalLink,
  ClipboardList, LayoutList, Pencil,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
}

interface ProposalSection {
  [key: string]: string;
}

interface ProposalVersion {
  id: string;
  version: number;
  sections: ProposalSection;
  createdAt: string;
}

interface Proposal {
  id: string;
  title: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED';
  currentVersion: number;
  createdAt: string;
  leadId: string;
  lead: Lead;
  versions: ProposalVersion[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTION_CONFIG = [
  { key: 'projectUnderstanding', label: 'Project Understanding', placeholder: 'Articulate your understanding of the client\'s goals, pain points, and expected outcomes...' },
  { key: 'scopeOfWork', label: 'Scope of Work', placeholder: 'Define the detailed scope of the engagement...' },
  { key: 'deliverables', label: 'Deliverables & Milestones', placeholder: 'List all deliverables, acceptance criteria, and milestone checkpoints...' },
  { key: 'techStack', label: 'Technology Stack', placeholder: 'Describe the technology choices and architecture rationale...' },
  { key: 'timeline', label: 'Project Timeline', placeholder: 'Provide the estimated week-by-week breakdown of the project...' },
  { key: 'teamStructure', label: 'Team Structure', placeholder: 'Describe the roles and responsibilities of the project team...' },
  { key: 'assumptions', label: 'Assumptions', placeholder: 'State any assumptions underlying the proposal...' },
  { key: 'exclusions', label: 'Exclusions', placeholder: 'Clearly list what is out of scope...' },
  { key: 'support', label: 'Support & Maintenance', placeholder: 'Describe the post-delivery support and maintenance plan...' },
  { key: 'terms', label: 'Terms & Conditions', placeholder: 'Outline the commercial terms, payment schedule, and legal agreements...' },
  { key: 'acceptance', label: 'Acceptance', placeholder: 'Define the acceptance process and what constitutes sign-off...' },
];

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  SENT: 'bg-indigo-900/40 text-indigo-300 border-indigo-700',
  ACCEPTED: 'bg-green-900/40 text-green-300 border-green-700',
  REJECTED: 'bg-red-900/40 text-red-300 border-red-700',
  ARCHIVED: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
};

// ─── Proposal Builder ─────────────────────────────────────────────────────────

function ProposalBuilder({
  initial,
  leads,
  onSave,
  onClose,
}: {
  initial?: Partial<Proposal> | null;
  leads: Lead[];
  onSave: (data: {
    title: string;
    leadId: string;
    sections: ProposalSection;
    status?: string;
  }) => Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [leadId, setLeadId] = useState(initial?.leadId || '');
  const [activeSection, setActiveSection] = useState(0);
  const [sections, setSections] = useState<ProposalSection>(
    initial?.versions?.[0]?.sections || {},
  );
  const [saving, setSaving] = useState(false);
  const [sendOnSave, setSendOnSave] = useState(false);

  const updateSection = (key: string, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!title.trim() || !leadId) return;
    setSaving(true);
    try {
      await onSave({ title, leadId, sections, status: sendOnSave ? 'SENT' : 'DRAFT' });
    } finally {
      setSaving(false);
    }
  };

  const currentSectionKey = SECTION_CONFIG[activeSection]?.key;
  const progress = Object.values(sections).filter((v) => v.trim().length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex bg-bg-base/95 backdrop-blur-sm overflow-hidden">
      {/* Left Section Nav */}
      <div className="w-64 flex-shrink-0 border-r border-border-default bg-bg-surface flex flex-col">
        <div className="p-5 border-b border-border-default">
          <div className="flex items-center gap-2 mb-1">
            <Pencil className="w-3.5 h-3.5 text-brand-primary" />
            <span className="font-mono text-[10px] text-brand-primary uppercase tracking-widest">
              Proposal Builder
            </span>
          </div>
          <p className="text-xs text-text-muted font-mono truncate">{title || '// Untitled Proposal'}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-text-muted">COMPLETENESS</span>
              <span className="font-mono text-[9px] text-brand-primary">{progress}/{SECTION_CONFIG.length}</span>
            </div>
            <div className="h-0.5 w-full bg-border-default rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary transition-all"
                style={{ width: `${(progress / SECTION_CONFIG.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SECTION_CONFIG.map((sec, i) => {
            const filled = (sections[sec.key] ?? '').trim().length > 0;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(i)}
                className={`w-full text-left px-3 py-2 text-[10px] font-mono flex items-center gap-2 border-l-2 transition-all ${
                  activeSection === i
                    ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${filled ? 'bg-green-400' : 'bg-zinc-600'}`} />
                {sec.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-default space-y-2">
          <div>
            <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Proposal Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-base border border-border-default text-text-primary text-[10px] font-mono px-2 py-1.5 focus:outline-none focus:border-brand-primary"
              placeholder="e.g. E-Commerce Platform Development"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Linked Lead</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full bg-bg-base border border-border-default text-text-primary text-[10px] font-mono px-2 py-1.5 focus:outline-none focus:border-brand-primary"
            >
              <option value="">— Select Lead —</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.companyName} · {l.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default flex-shrink-0">
          <div>
            <span className="font-mono text-xs text-brand-primary uppercase tracking-widest">
              // Section {activeSection + 1} of {SECTION_CONFIG.length}
            </span>
            <h2 className="font-heading font-bold text-lg text-text-primary">
              {SECTION_CONFIG[activeSection]?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="font-mono text-[10px] text-text-muted">Send on save</span>
              <div
                onClick={() => setSendOnSave((p) => !p)}
                className={`relative w-8 h-4 rounded-full transition-colors cursor-pointer ${sendOnSave ? 'bg-brand-primary' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${sendOnSave ? 'left-4.5' : 'left-0.5'}`} />
              </div>
            </label>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[10px] font-mono border border-border-default text-text-muted hover:text-text-primary transition-colors"
            >
              DISCARD
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !leadId || saving}
              className="px-5 py-1.5 text-[10px] font-mono font-bold bg-brand-primary text-white hover:bg-brand-primary/80 disabled:opacity-50 transition-colors"
            >
              {saving ? '...' : sendOnSave ? 'SAVE & SEND' : 'SAVE DRAFT'}
            </button>
          </div>
        </div>

        {/* Section Editor */}
        <div className="flex-1 p-8 overflow-y-auto">
          <textarea
            key={currentSectionKey}
            value={sections[currentSectionKey || ''] || ''}
            onChange={(e) => updateSection(currentSectionKey || '', e.target.value)}
            placeholder={SECTION_CONFIG[activeSection]?.placeholder}
            className="w-full h-full min-h-96 bg-transparent border-0 text-text-primary text-sm font-body leading-relaxed focus:outline-none resize-none placeholder:text-text-muted/30"
          />
        </div>

        {/* Section Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border-default flex-shrink-0">
          <button
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            className="px-4 py-2 text-[10px] font-mono border border-border-default text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
          >
            ← PREV SECTION
          </button>
          <span className="font-mono text-[10px] text-text-muted">
            {activeSection + 1} / {SECTION_CONFIG.length}
          </span>
          {activeSection < SECTION_CONFIG.length - 1 ? (
            <button
              onClick={() => setActiveSection(activeSection + 1)}
              className="flex items-center gap-1 px-4 py-2 text-[10px] font-mono border border-brand-primary/50 text-brand-primary hover:bg-brand-primary/10 transition-colors"
            >
              NEXT SECTION <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={!title.trim() || !leadId || saving}
              className="px-5 py-2 text-[10px] font-mono font-bold bg-brand-primary text-white hover:bg-brand-primary/80 disabled:opacity-50 transition-colors"
            >
              {saving ? '...' : '✓ COMPLETE PROPOSAL'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [proposalsRes, leadsRes] = await Promise.all([
        fetch('/api/proposals'),
        fetch('/api/leads?limit=200'),
      ]);
      const proposalsData = await proposalsRes.json();
      const leadsData = await leadsRes.json();
      setProposals(Array.isArray(proposalsData) ? proposalsData : proposalsData.proposals || []);
      setLeads(leadsData.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createOrUpdateProposal = async (data: {
    title: string;
    leadId: string;
    sections: ProposalSection;
    status?: string;
  }) => {
    const url = editingProposal ? `/api/proposals/${editingProposal.id}` : '/api/proposals';
    const method = editingProposal ? 'PATCH' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setBuilderOpen(false);
    setEditingProposal(null);
    fetchData();
  };

  const updateStatus = async (proposalId: string, status: string) => {
    setActionLoading(proposalId + status);
    try {
      await fetch(`/api/proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const duplicateProposal = async (proposal: Proposal) => {
    const latestVersion = proposal.versions?.[0];
    await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${proposal.title} (Copy)`,
        leadId: proposal.leadId,
        sections: latestVersion?.sections || {},
        status: 'DRAFT',
      }),
    });
    fetchData();
  };

  const filtered = proposals.filter((p) => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.lead?.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="bg-bg-base text-text-primary min-h-screen font-body">
      {/* Builder Modal */}
      {builderOpen && (
        <ProposalBuilder
          initial={editingProposal}
          leads={leads}
          onSave={createOrUpdateProposal}
          onClose={() => { setBuilderOpen(false); setEditingProposal(null); }}
        />
      )}

      {/* Header */}
      <div className="border-b border-border-default bg-bg-surface/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-brand-primary" />
          <span className="font-heading font-bold text-sm tracking-tight text-text-primary">HAWKEDGE ADMIN</span>
          <span className="font-mono text-xs text-text-muted">// PROPOSAL ENGINE</span>
        </div>
        <button
          onClick={() => { setEditingProposal(null); setBuilderOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-mono font-bold hover:bg-brand-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          NEW PROPOSAL
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-6">
        {/* Proposals List */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search proposals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-surface border border-border-default text-text-primary text-xs font-mono pl-8 pr-4 py-2 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-bg-surface border border-border-default text-text-primary text-xs font-mono pl-8 pr-8 py-2 focus:outline-none focus:border-brand-primary appearance-none"
              >
                <option value="">All Statuses</option>
                {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'ARCHIVED'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'ARCHIVED'].map((s) => (
              <div
                key={s}
                onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
                className={`border p-3 cursor-pointer transition-all ${
                  statusFilter === s ? 'border-brand-primary bg-brand-primary/5' : 'border-border-default bg-bg-surface/20 hover:border-brand-primary/50'
                }`}
              >
                <div className="font-mono text-xl font-bold text-text-primary mb-0.5">
                  {proposals.filter((p) => p.status === s).length}
                </div>
                <div className="font-mono text-[9px] text-text-muted uppercase">{s}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-16 font-mono text-xs text-text-muted">
              // LOADING PROPOSALS...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 font-mono text-xs text-text-muted">
              // NO PROPOSALS MATCH CURRENT FILTERS
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal === selectedProposal ? null : proposal)}
                  className={`border p-4 cursor-pointer transition-all ${
                    selectedProposal?.id === proposal.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-border-default bg-bg-surface/20 hover:border-border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${STATUS_STYLES[proposal.status]}`}>
                          {proposal.status}
                        </span>
                        <span className="font-mono text-[9px] text-text-muted">v{proposal.currentVersion}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-sm text-text-primary truncate">
                        {proposal.title}
                      </h3>
                      <p className="font-mono text-[10px] text-text-muted mt-0.5">
                        {proposal.lead?.companyName} · {proposal.lead?.fullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Edit */}
                      {(proposal.status === 'DRAFT' || proposal.status === 'REJECTED') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingProposal(proposal); setBuilderOpen(true); }}
                          className="p-1.5 border border-border-default text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      {/* Send */}
                      {proposal.status === 'DRAFT' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(proposal.id, 'SENT'); }}
                          disabled={actionLoading === proposal.id + 'SENT'}
                          className="p-1.5 border border-border-default text-text-muted hover:text-indigo-400 hover:border-indigo-700 transition-colors"
                          title="Send to Client"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      )}
                      {/* Archive */}
                      {proposal.status !== 'ARCHIVED' && proposal.status !== 'ACCEPTED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(proposal.id, 'ARCHIVED'); }}
                          disabled={actionLoading === proposal.id + 'ARCHIVED'}
                          className="p-1.5 border border-border-default text-text-muted hover:text-yellow-400 hover:border-yellow-700 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                        </button>
                      )}
                      {/* Duplicate */}
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateProposal(proposal); }}
                        className="p-1.5 border border-border-default text-text-muted hover:text-text-primary transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {/* Portal link */}
                      <a
                        href={`http://localhost:3000/proposals/${proposal.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 border border-border-default text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                        title="View Client Portal"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-text-muted transition-transform ${selectedProposal?.id === proposal.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {selectedProposal?.id === proposal.id && (
                    <div className="mt-4 pt-4 border-t border-border-default">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-mono text-[9px] text-text-muted block mb-1">CLIENT</span>
                          <p className="text-xs text-text-secondary">{proposal.lead?.fullName}</p>
                          <p className="text-xs text-text-muted">{proposal.lead?.email}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] text-text-muted block mb-1">CREATED</span>
                          <p className="text-xs text-text-secondary">
                            {new Date(proposal.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Version History */}
                      {proposal.versions && proposal.versions.length > 0 && (
                        <div className="mt-4">
                          <span className="font-mono text-[9px] text-text-muted block mb-2">VERSION HISTORY</span>
                          <div className="space-y-1">
                            {proposal.versions.map((v) => (
                              <div key={v.id} className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                                <span>v{v.version}</span>
                                <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section Completeness */}
                      <div className="mt-4">
                        <span className="font-mono text-[9px] text-text-muted block mb-2">SECTION COMPLETENESS</span>
                        <div className="grid grid-cols-3 gap-1">
                          {SECTION_CONFIG.map((sec) => {
                            const latestVersion = proposal.versions?.[0];
                            const hasContent = (latestVersion?.sections?.[sec.key] ?? '').trim().length > 0;
                            return (
                              <div
                                key={sec.key}
                                className={`flex items-center gap-1 text-[9px] font-mono ${hasContent ? 'text-green-400' : 'text-text-muted/40'}`}
                              >
                                <span>{hasContent ? '✓' : '○'}</span>
                                <span className="truncate">{sec.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Summary Panel */}
        <div className="hidden xl:block w-64 flex-shrink-0 space-y-4">
          <div className="border border-border-default bg-bg-surface/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <LayoutList className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono text-[10px] text-brand-primary uppercase">Quick Stats</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Total Proposals', value: proposals.length },
                { label: 'Acceptance Rate', value: proposals.length > 0 ? `${Math.round((proposals.filter((p) => p.status === 'ACCEPTED').length / proposals.length) * 100)}%` : '—' },
                { label: 'Pending Review', value: proposals.filter((p) => p.status === 'SENT').length },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-muted">{stat.label}</span>
                  <span className="font-mono text-[10px] text-text-primary font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border-default bg-bg-surface/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono text-[10px] text-brand-primary uppercase">Tips</span>
            </div>
            <div className="space-y-2 text-[10px] font-mono text-text-muted">
              <p>// Use the Builder to fill each section before sending.</p>
              <p>// Client sees a portal link — each proposal has a unique URL.</p>
              <p>// Accepting a proposal provisions the client workspace automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
