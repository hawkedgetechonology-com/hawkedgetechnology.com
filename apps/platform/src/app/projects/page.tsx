'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Search,
  Filter,
  Tag
} from 'lucide-react';

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
  milestones: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/studio/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  const getProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0;
    const completed = project.milestones.filter((m) => m.status === 'COMPLETED').length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// INITIALIZING SYSTEM REPOSITORIES...</span>
      </div>
    );
  }

  const statusOptions = ['ALL', 'PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'DELAYED'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title block */}
      <div>
        <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
          OPERATIONAL INVENTORY
        </span>
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
          Project Ledgers
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Active system integrations, architecture builds, and SLA delivery status logs.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search project repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle text-text-primary font-mono text-[10px] pl-10 pr-4 py-2 focus:outline-none focus:border-brand-primary rounded-xs transition-colors"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-text-muted hidden sm:block" />
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 font-mono text-[8px] tracking-wider uppercase border rounded-xs transition-all ${
                statusFilter === opt
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                  : 'border-border-subtle bg-bg-surface/30 text-text-muted hover:text-text-primary'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <FolderKanban className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            No Records Retrieved
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            No projects matched current filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = getProgress(project);
            return (
              <div
                key={project.id}
                className="border border-border-subtle bg-bg-surface/35 rounded-md p-6 flex flex-col justify-between hover:border-brand-primary/55 transition-colors group relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-border-subtle group-hover:bg-brand-primary transition-colors" />

                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-primary" />
                      ID: {project.id.substring(0, 8).toUpperCase()}
                    </span>
                    <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                      project.status === 'IN_PROGRESS'
                        ? 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary'
                        : project.status === 'REVIEW'
                        ? 'border-indigo-500/30 bg-indigo-950/15 text-indigo-400'
                        : project.status === 'COMPLETED'
                        ? 'border-semantic-success/30 bg-semantic-success-bg/10 text-semantic-success'
                        : 'border-border-default bg-bg-base/30 text-text-muted'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Title & SOW */}
                  <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-brand-primary transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-3 mb-6">
                    {project.description || 'No systems brief provided.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Progress panel */}
                  <div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-text-muted mb-1.5">
                      <span>PROJECT METRICS</span>
                      <span>{progress}% COMPLETE</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeline parameters */}
                  <div className="grid grid-cols-2 gap-4 border-y border-border-subtle/50 py-3 font-mono text-[9px] text-text-muted">
                    <div>
                      <span className="block text-[8px] text-text-muted/60 uppercase">BUDGET ESTIMATE</span>
                      <span className="text-text-primary font-bold">{project.budget || '$50,000'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-text-muted/60 uppercase">TARGET DATE</span>
                      <span className="text-text-primary font-bold">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>

                  {/* Open details action */}
                  <Link
                    href={`/projects/${project.id}`}
                    className="w-full py-2 bg-bg-surface border border-border-default hover:border-brand-primary text-text-secondary hover:text-text-primary text-center block font-mono text-[9px] uppercase tracking-wider hover:bg-bg-hover transition-all rounded-xs"
                  >
                    Ingest Project Console
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
