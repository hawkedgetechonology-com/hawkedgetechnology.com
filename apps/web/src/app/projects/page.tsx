'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, RefreshCw } from 'lucide-react';

interface Project {
  code: string;
  name: string;
  industry: 'Logistics' | 'Healthcare' | 'Education' | 'Finance';
  technology: string[];
  businessProblem: 'Legacy Bottleneck' | 'Automation' | 'Operations Scale' | 'Real-time Analysis';
  status: 'Completed' | 'In Progress';
  summary: string;
  impact: string;
}

const projectsLedger: Project[] = [
  {
    code: 'PRJ-ALPHA',
    name: 'Enterprise Route Logistics Optimizer',
    industry: 'Logistics',
    technology: ['Next.js', 'NestJS', 'PostgreSQL', 'AWS'],
    businessProblem: 'Legacy Bottleneck',
    status: 'Completed',
    summary: 'A real-time routing engine handling scheduling for 500+ commercial vehicles. Resolved critical database transaction deadlocks under heavy write loads.',
    impact: '18% fuel cost reduction and 35-minute average scheduling latency reduction.',
  },
  {
    code: 'PRJ-DELTA',
    name: 'Autonomous AI Clinical Documenter',
    industry: 'Healthcare',
    technology: ['Python', 'PyTorch', 'FastAPI', 'Whisper'],
    businessProblem: 'Automation',
    status: 'Completed',
    summary: 'Fine-tuned speech-to-text algorithms integrated directly with electronic health record platforms. Transcribes patient consultations in real-time.',
    impact: 'Cut clinical note drafting workloads by 3 hours per physician per day.',
  },
  {
    code: 'PRJ-SIGMA',
    name: 'Automated EdTech Code Evaluator',
    industry: 'Education',
    technology: ['Next.js', 'Node.js', 'Prisma', 'Turborepo'],
    businessProblem: 'Operations Scale',
    status: 'In Progress',
    summary: 'Isolated sandboxed code runner compilation system. Evaluates developer student submissions against compiler standards and style checklists automatically.',
    impact: 'Currently grading 4,000+ submissions daily with sub-second feedback latency.',
  },
  {
    code: 'PRJ-OMEGA',
    name: 'Real-time Risk Analytics Dashboard',
    industry: 'Finance',
    technology: ['Go', 'Kafka', 'Cassandra', 'Docker'],
    businessProblem: 'Real-time Analysis',
    status: 'Completed',
    summary: 'High-throughput event queue parsing 10,000 credit card transaction logs per second, matching fraud criteria and database records with extreme speed.',
    impact: 'Reduced fraud false-positives by 22% with sub-50ms check latency.',
  },
];

export default function ProjectsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [selectedTech, setSelectedTech] = useState<string>('ALL');
  const [selectedProblem, setSelectedProblem] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // List all unique tech options for dropdown
  const allTechOptions = useMemo(() => {
    const techs = new Set<string>();
    projectsLedger.forEach((p) => p.technology.forEach((t) => techs.add(t)));
    return Array.from(techs);
  }, []);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projectsLedger.filter((project) => {
      const matchIndustry = selectedIndustry === 'ALL' || project.industry === selectedIndustry;
      const matchTech = selectedTech === 'ALL' || project.technology.includes(selectedTech);
      const matchProblem = selectedProblem === 'ALL' || project.businessProblem === selectedProblem;
      const matchStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
      return matchIndustry && matchTech && matchProblem && matchStatus;
    });
  }, [selectedIndustry, selectedTech, selectedProblem, selectedStatus]);

  const resetFilters = () => {
    setSelectedIndustry('ALL');
    setSelectedTech('ALL');
    setSelectedProblem('ALL');
    setSelectedStatus('ALL');
  };

  const hasActiveFilters = 
    selectedIndustry !== 'ALL' || 
    selectedTech !== 'ALL' || 
    selectedProblem !== 'ALL' || 
    selectedStatus !== 'ALL';

  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-12">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 03 / PROJECT RECORD
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Engineering Ledger.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            An active audit log of core platforms engineered by our team. Filtered by industry sector, technological coordinates, status, and business objectives.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="border border-border-default bg-bg-surface/30 p-6 mb-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <span className="font-mono text-xs text-text-primary flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-brand-primary" /> FILTER CRITERIA
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="font-mono text-[10px] text-text-muted hover:text-text-primary flex items-center gap-1 focus:outline-none"
              >
                <RefreshCw className="w-3 h-3" /> RESET FILTERS
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Industry Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-industry" className="font-mono text-[9px] text-text-muted uppercase">
                // INDUSTRY
              </label>
              <select
                id="filter-industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="bg-bg-subtle border border-border-default text-xs text-text-primary h-10 px-3 focus:outline-none focus:border-brand-primary rounded-xs"
              >
                <option value="ALL">All Industries</option>
                <option value="Logistics">Logistics</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Tech Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-tech" className="font-mono text-[9px] text-text-muted uppercase">
                // TECHNOLOGY
              </label>
              <select
                id="filter-tech"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="bg-bg-subtle border border-border-default text-xs text-text-primary h-10 px-3 focus:outline-none focus:border-brand-primary rounded-xs"
              >
                <option value="ALL">All Technologies</option>
                {allTechOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Business Problem Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-problem" className="font-mono text-[9px] text-text-muted uppercase">
                // BUSINESS PROBLEM
              </label>
              <select
                id="filter-problem"
                value={selectedProblem}
                onChange={(e) => setSelectedProblem(e.target.value)}
                className="bg-bg-subtle border border-border-default text-xs text-text-primary h-10 px-3 focus:outline-none focus:border-brand-primary rounded-xs"
              >
                <option value="ALL">All Problems</option>
                <option value="Legacy Bottleneck">Legacy Bottleneck</option>
                <option value="Automation">Automation</option>
                <option value="Operations Scale">Operations Scale</option>
                <option value="Real-time Analysis">Real-time Analysis</option>
              </select>
            </div>

            {/* Status Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="filter-status" className="font-mono text-[9px] text-text-muted uppercase">
                // PLATFORM STATUS
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-bg-subtle border border-border-default text-xs text-text-primary h-10 px-3 focus:outline-none focus:border-brand-primary rounded-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 font-mono text-[10px] text-text-muted">
          <span>
            FOUND {filteredProjects.length} OF {projectsLedger.length} PROJECTS MATCHING COORDINATES
          </span>
        </div>

        {/* Ledger Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.code}
                className="border border-border-default bg-bg-surface/10 p-6 sm:p-8 flex flex-col justify-between hover:border-border-strong transition-colors duration-200"
              >
                <div>
                  <div className="flex justify-between items-baseline mb-4 border-b border-border-subtle pb-3">
                    <span className="font-mono text-[10px] text-text-muted">{project.code}</span>
                    <span
                      className={`font-mono text-[9px] border px-2 py-0.5 rounded-sm ${
                        project.status === 'Completed'
                          ? 'bg-green-950/80 text-green-400 border-green-800'
                          : 'bg-blue-950/80 text-blue-400 border-blue-800 animate-pulse'
                      }`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-text-primary mb-3">
                    {project.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4 bg-bg-subtle/40 p-3 border border-border-subtle/50 font-mono text-[9px] text-text-muted">
                    <div>
                      <span className="text-text-secondary">SECTOR:</span> {project.industry.toUpperCase()}
                    </div>
                    <div>
                      <span className="text-text-secondary">OBJECTIVE:</span> {project.businessProblem.toUpperCase()}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-6 font-body">
                    {project.summary}
                  </p>

                  <div className="mb-6 border-l-2 border-brand-primary pl-4 py-1">
                    <span className="font-mono text-[9px] text-brand-primary uppercase block mb-1">
                      VERIFIED IMPACT:
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed font-body">
                      {project.impact}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technology.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] bg-bg-elevated border border-border-subtle text-text-muted px-2 py-0.5 rounded-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link href="/case-studies" className="font-mono text-xs text-brand-primary hover:text-text-primary flex items-center gap-1.5 focus:outline-none">
                    Case Study <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border-default bg-bg-surface/20 p-12 text-center flex flex-col items-center justify-center gap-4">
            <span className="font-mono text-xs text-text-muted">// QUERY_EMPTY</span>
            <p className="text-xs text-text-secondary font-body">
              No projects in the ledger match the currently active filter query coordinates.
            </p>
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-brand-primary hover:text-text-primary underline focus:outline-none"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
