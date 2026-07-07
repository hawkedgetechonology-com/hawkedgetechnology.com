'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  ExternalLink,
  Code,
  Globe,
  Download,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  FileIcon
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dateLabel: string | null;
  owner: string | null;
  completion: number;
}

interface ProjectFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: string;
  version: number;
  uploadedBy: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  budget: string | null;
  startDate: string | null;
  endDate: string | null;
  techStack: string[];
  repoUrl: string | null;
  envUrl: string | null;
  milestones: Milestone[];
  files: ProjectFile[];
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TIMELINE' | 'FILES' | 'DOCS'>('OVERVIEW');
  const [activeFileCategory, setActiveFileCategory] = useState<string>('DOCUMENTS');

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/studio/projects/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load project details');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        setLoading(false);
      });
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// INGESTING SYSTEM BLUEPRINT DETAILS...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="border border-red-500/20 bg-semantic-danger-bg/20 p-6 rounded-md text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-semantic-danger mx-auto mb-3" />
        <h3 className="font-heading font-bold text-text-primary text-sm mb-1">Ingestion Failure</h3>
        <p className="font-mono text-[10px] text-text-muted">Project ID is invalid or access was denied.</p>
        <button
          onClick={() => router.push('/projects')}
          className="mt-4 px-4 py-2 font-mono text-[9px] uppercase tracking-wider bg-bg-surface border border-border-default hover:border-brand-primary text-text-primary transition-all rounded-xs"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  // Calculate Progress
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // File categories filter
  const fileCategories = ['CONTRACTS', 'DESIGNS', 'DOCUMENTS', 'DELIVERABLES'];

  const filteredFiles = project.files.filter((f) => f.category === activeFileCategory);

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-semantic-success flex-shrink-0" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="w-5 h-5 text-brand-primary flex-shrink-0 animate-pulse" />;
      case 'CLIENT_REVIEW':
        return <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />;
      default:
        return <HelpCircle className="w-5 h-5 text-text-muted/50 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Detail Header block */}
      <div className="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-2 py-0.5 rounded-xs uppercase">
              Project Registry
            </span>
            <span className="font-mono text-[9px] text-text-muted">
              REF: {project.id.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
            {project.name}
          </h1>
          <p className="font-sans text-xs text-text-muted max-w-3xl">
            {project.description || 'Systems development lifecycle dashboard.'}
          </p>
        </div>

        {/* Project Status pill */}
        <div className="flex items-center gap-4 font-mono text-[10px] text-text-muted flex-shrink-0">
          <div>
            <span className="block text-[8px] text-text-muted/60 uppercase">BUDGET ESTIMATE</span>
            <span className="text-text-primary font-bold">{project.budget || '$50,000'}</span>
          </div>
          <div className="h-8 w-px bg-border-subtle" />
          <div>
            <span className="block text-[8px] text-text-muted/60 uppercase">INTEGRATION STATUS</span>
            <span className={`font-bold uppercase tracking-wider block ${
              project.status === 'IN_PROGRESS' ? 'text-brand-primary' : 'text-semantic-success'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border-subtle overflow-x-auto pb-px">
        {(['OVERVIEW', 'TIMELINE', 'FILES', 'DOCS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-mono text-[9px] tracking-wider uppercase border-b-2 transition-all flex-shrink-0 ${
              activeTab === tab
                ? 'border-brand-primary text-brand-primary bg-brand-primary/5'
                : 'border-transparent text-text-muted hover:text-text-primary hover:bg-bg-hover/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {/* OVERVIEW PANEL */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview Detail left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Scope/Metrics panel */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
                    SOW Scope Overview
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {project.description || 'System scope details have not been explicitly set. Please contact your systems architect.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-bg-base/30 p-4 border border-border-subtle/50 rounded-sm">
                  <div>
                    <span className="font-mono text-[8px] text-text-muted uppercase">Milestones Target</span>
                    <p className="font-heading font-bold text-sm text-text-primary mt-1">
                      {completedMilestones} / {totalMilestones} Completed
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-text-muted uppercase">Deployment Phase Progress</span>
                    <p className="font-heading font-bold text-sm text-brand-primary mt-1">
                      {progressPercent}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Technologies Panel */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md">
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
                  Tech Stack Integration
                </h3>
                {project.techStack.length === 0 ? (
                  <p className="font-mono text-[9px] text-text-muted">// TECHNOLOGY METRICS NOT SPECIFIED</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="font-mono text-[9px] bg-bg-base border border-border-subtle text-text-secondary px-3 py-1.5 rounded-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Overview links right */}
            <div className="space-y-6">
              {/* Deployment Assets */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
                  System Coordinates
                </h3>

                <div className="space-y-3 font-mono text-[10px]">
                  {project.repoUrl ? (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-border-subtle bg-bg-base/30 hover:border-brand-primary transition-all rounded-xs text-text-secondary hover:text-text-primary"
                    >
                      <span className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-brand-primary" /> Repository SCM
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs text-text-muted/60">
                      Repo Link: Not Linked
                    </div>
                  )}

                  {project.envUrl ? (
                    <a
                      href={project.envUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-border-subtle bg-bg-base/30 hover:border-brand-primary transition-all rounded-xs text-text-secondary hover:text-text-primary"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand-primary" /> Production Live URL
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs text-text-muted/60">
                      Live URL: Pending Canary Launch
                    </div>
                  )}
                </div>
              </div>

              {/* Sprints Details */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-3">
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
                  Delivery Timelines
                </h3>
                <div className="font-mono text-[10px] space-y-2 text-text-muted">
                  <div className="flex justify-between border-b border-border-subtle/40 pb-2">
                    <span>Target Kickoff</span>
                    <span className="text-text-primary">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>SLA Completion</span>
                    <span className="text-text-primary font-bold">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE PANEL */}
        {activeTab === 'TIMELINE' && (
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md max-w-3xl">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-8">
              Visual roadmap & active sprints
            </h3>

            {project.milestones.length === 0 ? (
              <div className="text-center py-10 font-mono text-[10px] text-text-muted">
                // SYSTEM TIMELINE EMPTY
              </div>
            ) : (
              <div className="relative border-l border-border-subtle pl-6 ml-3 space-y-8">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="relative group">
                    {/* Node status dot */}
                    <div className="absolute -left-[37px] top-0 bg-bg-base p-1 border border-border-subtle rounded-full z-10 transition-transform group-hover:scale-110">
                      {getMilestoneIcon(milestone.status)}
                    </div>

                    <div className="space-y-1 bg-bg-base/30 border border-border-subtle/50 p-4 rounded-sm hover:border-brand-primary/45 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="font-heading font-bold text-xs text-text-primary">
                          {milestone.title}
                        </h4>
                        <span className={`font-mono text-[8px] border px-2 py-0.5 rounded-full w-fit uppercase ${
                          milestone.status === 'COMPLETED'
                            ? 'border-semantic-success/20 text-semantic-success bg-semantic-success-bg/10'
                            : milestone.status === 'IN_PROGRESS'
                            ? 'border-brand-primary/20 text-brand-primary bg-brand-primary/5'
                            : 'border-border-default text-text-muted'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {milestone.description || 'No sprint brief provided.'}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle/30 mt-3 font-mono text-[9px] text-text-muted">
                        <span>OWNER: {milestone.owner || 'SRE TEAM'}</span>
                        <div className="flex items-center gap-4">
                          <span>Sprint: {milestone.dateLabel || 'TBD'}</span>
                          <span className="text-brand-primary font-bold">{milestone.completion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FILES PANEL */}
        {activeTab === 'FILES' && (
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4 mb-6">
              <div>
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Project Assets & Deliverables
                </h3>
                <p className="font-sans text-[11px] text-text-muted mt-0.5">
                  Secure download matrix for documents, designs, and releases.
                </p>
              </div>

              {/* Categories selection */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {fileCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFileCategory(cat)}
                    className={`px-3 py-1 font-mono text-[8px] tracking-wider uppercase border rounded-xs transition-all ${
                      activeFileCategory === cat
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-border-subtle bg-bg-base/30 text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-16 font-mono text-[10px] text-text-muted">
                // SYSTEM LOG: NO FILES FOUND IN CATEGORY: {activeFileCategory}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 border border-border-subtle bg-bg-base/40 rounded-sm hover:border-brand-primary/50 transition-colors flex items-start gap-3"
                  >
                    <FileIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-heading font-semibold text-xs text-text-primary truncate" title={file.fileName}>
                        {file.fileName}
                      </h4>
                      <p className="font-mono text-[8px] text-text-muted">
                        Size: {(file.fileSize / 1024).toFixed(1)} KB &bull; Version: v{file.version}
                      </p>
                      <p className="font-mono text-[8px] text-text-muted">
                        Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9px] text-brand-primary hover:underline inline-flex items-center gap-1 mt-2 uppercase tracking-wider"
                      >
                        DOWNLOAD FILE <Download className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'DOCS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Associated Proposals and Invoices */}
            <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
                Operational Briefing Docs
              </h3>
              <p className="text-xs text-text-muted">
                Every document created during consultation, design, and execution phases.
              </p>

              <div className="space-y-3 font-mono text-[10px] text-text-secondary">
                {/* Simulated Proposal documents */}
                <div className="p-3 border border-border-subtle/50 bg-bg-base/20 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <span>SYSTEMS DESIGN PROPOSAL</span>
                  </div>
                  <span className="text-[8px] text-text-muted font-bold">PDF READY</span>
                </div>

                <div className="p-3 border border-border-subtle/50 bg-bg-base/20 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <span>SLA COMMERCIAL BRIEF (Q-2026-001)</span>
                  </div>
                  <span className="text-[8px] text-text-muted font-bold">PDF READY</span>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
                Project Invoices Ledger
              </h3>
              <p className="text-xs text-text-muted">
                Invoice statements linked directly to milestones.
              </p>

              {project.invoices.length === 0 ? (
                <div className="text-center py-6 font-mono text-[10px] text-text-muted">
                  // LOG CLEAR: NO INVOICES
                </div>
              ) : (
                <div className="space-y-3 font-mono text-[10px]">
                  {project.invoices.map((inv) => (
                    <div key={inv.id} className="p-3 border border-border-subtle bg-bg-base/30 rounded-sm flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-text-primary font-bold">{inv.invoiceNumber}</span>
                        <p className="text-[8px] text-text-muted">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-text-primary font-bold">${inv.amount.toLocaleString()}</span>
                        <span className={`text-[8px] border px-1.5 py-0.5 rounded-full ${
                          inv.status === 'PAID' ? 'border-semantic-success/35 text-semantic-success bg-semantic-success-bg/10' : 'border-semantic-danger/35 text-semantic-danger bg-semantic-danger-bg/10'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
