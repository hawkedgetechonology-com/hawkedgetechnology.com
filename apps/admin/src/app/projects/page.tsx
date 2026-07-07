'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  ExternalLink,
  Code,
  Globe
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
  client: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      companyName: string | null;
    } | null;
  };
  milestones: Milestone[];
}

export default function ProjectsOperations() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // New Milestone Form State
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [milestoneOwner, setMilestoneOwner] = useState('');
  const [milestoneStatus, setMilestoneStatus] = useState('UPCOMING');
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

  // Milestone edit state
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editCompletion, setEditCompletion] = useState(0);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject((prev) => {
          const found = data.find((p: Project) => p.id === prev?.id);
          return found || data[0];
        });
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateProjectStatus = async (status: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !milestoneTitle.trim()) return;
    setSubmittingMilestone(true);

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: milestoneTitle,
          description: milestoneDesc,
          status: milestoneStatus,
          dateLabel: milestoneDate,
          owner: milestoneOwner,
          completion: 0,
        }),
      });
      if (res.ok) {
        setMilestoneTitle('');
        setMilestoneDesc('');
        setMilestoneDate('');
        setMilestoneOwner('');
        setMilestoneStatus('UPCOMING');
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingMilestone(false);
    }
  };

  const handleSaveMilestoneEdit = async (milestoneId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/milestones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId,
          status: editStatus,
          completion: editCompletion,
        }),
      });
      if (res.ok) {
        setEditingMilestoneId(null);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0;
    const completed = project.milestones.filter((m) => m.status === 'COMPLETED').length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// HARNESSING HAWKEDGE OPERATIONS COCKPIT FILES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title block */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          OPERATIONAL COMMAND & EXECUTION
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Project Operations
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Manage milestones deliverables schedules, team sprint assignments, project statuses, and live environments.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <FolderKanban className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            No Active Projects
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            Build workspaces from SOW proposal acceptance triggers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel list */}
          <div className="lg:col-span-5 border border-border-subtle bg-bg-surface/35 p-4 rounded-md h-[calc(100vh-280px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4 font-mono text-[9px] text-text-muted">
              <span>Operational Projects</span>
              <span>{projects.length} Registries</span>
            </div>

            <div className="space-y-2">
              {projects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const progress = getProgress(project);
                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-900/10'
                        : 'border-border-subtle/50 bg-bg-base/20 hover:border-border-default'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-heading font-bold text-xs text-text-primary truncate">
                        {project.name}
                      </h3>
                      <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                        project.status === 'IN_PROGRESS'
                          ? 'border-purple-400 bg-purple-950/15 text-purple-400'
                          : 'border-semantic-success/20 text-semantic-success bg-semantic-success-bg/10'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted mb-2">
                      <span>Client: {project.client.profile?.companyName || 'Private partner'}</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="w-full h-1 bg-bg-base rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel details */}
          {selectedProject && (
            <div className="lg:col-span-7 border border-border-subtle bg-bg-surface/35 p-6 rounded-md min-h-[500px] space-y-6">
              {/* Project Title Block */}
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-lg tracking-tight text-text-primary">
                    {selectedProject.name}
                  </h2>
                  <p className="font-mono text-[10px] text-text-muted mt-1">
                    Client: {selectedProject.client.profile?.firstName} {selectedProject.client.profile?.lastName} &bull; Company: {selectedProject.client.profile?.companyName || 'Corporate partner'}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-[9px]">
                  <select
                    value={selectedProject.status}
                    onChange={(e) => handleUpdateProjectStatus(e.target.value)}
                    className="bg-bg-base border border-border-subtle text-text-primary px-3 py-1.5 focus:outline-none focus:border-purple-400 rounded-xs"
                  >
                    <option value="PLANNING">PLANNING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="REVIEW">CLIENT REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>
              </div>

              {/* SCM Links details */}
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-text-muted">
                {selectedProject.repoUrl ? (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border-subtle bg-bg-base/30 rounded-xs flex items-center justify-between text-text-secondary hover:text-text-primary hover:border-purple-400 transition-all"
                  >
                    <span className="flex items-center gap-2"><Code className="w-4 h-4 text-purple-400" /> SCM REPOSITORY</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs text-text-muted/60">
                    Repository: Not Linked
                  </div>
                )}
                {selectedProject.envUrl ? (
                  <a
                    href={selectedProject.envUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border-subtle bg-bg-base/30 rounded-xs flex items-center justify-between text-text-secondary hover:text-text-primary hover:border-purple-400 transition-all"
                  >
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-purple-400" /> LIVE canary environment</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs text-text-muted/60">
                    Environment: Pending Setup
                  </div>
                )}
              </div>

              {/* Milestones list and editing */}
              <div className="space-y-4">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wide block">Operational Sprints Milestones</span>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedProject.milestones.map((m) => {
                    const isEditing = editingMilestoneId === m.id;
                    return (
                      <div
                        key={m.id}
                        className="p-3 border border-border-subtle/50 bg-bg-base/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px]"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-text-primary font-bold block">{m.title}</span>
                          <span className="text-text-muted text-[8px] block mt-0.5">
                            Owner: {m.owner || 'Devops SRE'} &bull; Target: {m.dateLabel || 'TBD'}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-3">
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-2 py-1 focus:outline-none"
                            >
                              <option value="UPCOMING">UPCOMING</option>
                              <option value="IN_PROGRESS">IN PROGRESS</option>
                              <option value="CLIENT_REVIEW">CLIENT REVIEW</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="DELAYED">DELAYED</option>
                            </select>
                            <input
                              type="number"
                              value={editCompletion}
                              onChange={(e) => setEditCompletion(Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-1.5 py-1 w-12 text-center"
                              min="0"
                              max="100"
                            />
                            <button
                              onClick={() => handleSaveMilestoneEdit(m.id)}
                              className="px-2 py-1 bg-purple-500 text-white text-[8px] uppercase font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-right flex-shrink-0">
                            <div>
                              <span className="block text-[8px] text-text-muted/60">Status</span>
                              <span className={`text-[8px] border px-1.5 py-0.5 rounded-full ${
                                m.status === 'COMPLETED' ? 'border-semantic-success/20 text-semantic-success' : 'border-border-default text-text-muted'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-text-muted/60">Percent</span>
                              <span className="text-text-primary font-bold">{m.completion}%</span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingMilestoneId(m.id);
                                setEditStatus(m.status);
                                setEditCompletion(m.completion);
                              }}
                              className="font-mono text-[8px] text-purple-400 hover:underline uppercase"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Milestone Form */}
              <div className="border-t border-border-subtle/50 pt-4 space-y-4">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wide block">Schedule new milestone SOW</span>

                <form onSubmit={handleCreateMilestone} className="space-y-3 font-mono text-[9px]">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Milestone Title"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      className="bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none focus:border-purple-400 rounded-xs"
                      required
                    />
                    <input
                      placeholder="Date Label (e.g. Sprint 4)"
                      value={milestoneDate}
                      onChange={(e) => setMilestoneDate(e.target.value)}
                      className="bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none focus:border-purple-400 rounded-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Sprint Owner (e.g. Lead Dev)"
                      value={milestoneOwner}
                      onChange={(e) => setMilestoneOwner(e.target.value)}
                      className="bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none focus:border-purple-400 rounded-xs"
                    />
                    <select
                      value={milestoneStatus}
                      onChange={(e) => setMilestoneStatus(e.target.value)}
                      className="bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none focus:border-purple-400 rounded-xs"
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="CLIENT_REVIEW">CLIENT REVIEW</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Milestone Description details..."
                    value={milestoneDesc}
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-bg-base border border-border-subtle text-text-primary p-3 focus:outline-none focus:border-purple-400 rounded-xs resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingMilestone}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs"
                    >
                      {submittingMilestone ? 'Scheduling...' : 'Schedule Milestone'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
