'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Clock,
  Briefcase,
  Layers,
  Calendar,
  FileText,
  MessageSquare,
  Trash2,
  RefreshCw,
  TrendingUp,
  UserPlus,
  CheckCircle,
} from 'lucide-react';

interface Lead {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  buildType: string;
  leadScore: number;
  leadPriority: string;
  status: 'NEW' | 'CONTACTED' | 'CONSULTATION_SCHEDULED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  assignedTo: string | null;
  internalNotes: string | null;
  rawAnswers: Record<string, unknown>;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meetings?: any[];
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

const PIPELINE_STAGES: Lead['status'][] = [
  'NEW',
  'CONTACTED',
  'CONSULTATION_SCHEDULED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
];

export default function AdminCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Input states for updates
  const [noteText, setNoteText] = useState('');
  const [assigneeText, setAssigneeText] = useState('');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);
      if (priorityFilter) query.append('priority', priorityFilter);
      query.append('sortBy', sortBy);
      query.append('order', sortBy === 'leadScore' ? 'desc' : 'desc');

      const res = await fetch(`/api/leads?${query.toString()}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
        if (data.leads.length > 0 && !selectedLeadId) {
          setSelectedLeadId(data.leads[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load CRM leads', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      const data = await res.json();
      if (data) {
        setSelectedLead(data);
        setAssigneeText(data.assignedTo || '');
      }

      const actRes = await fetch(`/api/leads/${id}/activity`);
      const actData = await actRes.json();
      if (actData.activity) {
        setActivities(actData.activity);
      }
    } catch (e) {
      console.error('Failed to fetch lead details', e);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    if (selectedLeadId) {
      fetchLeadDetails(selectedLeadId);
    } else {
      setSelectedLead(null);
      setActivities([]);
    }
  }, [selectedLeadId]);

  const handleUpdateStatus = async (status: Lead['status']) => {
    if (!selectedLeadId) return;
    try {
      const res = await fetch(`/api/leads/${selectedLeadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchLeads();
        fetchLeadDetails(selectedLeadId);
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleUpdateMeetingStatus = async (meetingId: string, status: string) => {
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchLeads();
        if (selectedLeadId) {
          fetchLeadDetails(selectedLeadId);
        }
      }
    } catch (e) {
      console.error('Failed to update meeting status', e);
    }
  };

  const handleAssignOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;
    try {
      const res = await fetch(`/api/leads/${selectedLeadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: assigneeText }),
      });
      if (res.ok) {
        fetchLeads();
        fetchLeadDetails(selectedLeadId);
      }
    } catch (e) {
      console.error('Failed to assign lead', e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !noteText.trim()) return;
    try {
      const res = await fetch(`/api/leads/${selectedLeadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText }),
      });
      if (res.ok) {
        setNoteText('');
        fetchLeadDetails(selectedLeadId);
      }
    } catch (e) {
      console.error('Failed to add note', e);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLeadId || !confirm('Are you sure you want to soft delete this lead record?')) return;
    try {
      const res = await fetch(`/api/leads/${selectedLeadId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedLeadId(null);
        fetchLeads();
      }
    } catch (e) {
      console.error('Failed to delete lead', e);
    }
  };

  // Recommendations helper mapper
  const getRecommendationSummary = (type: string) => {
    const t = (type || '').toUpperCase();
    if (t === 'WEBSITE') {
      return {
        tech: 'Next.js (App Router), React 19, Tailwind CSS, Framer Motion, TypeScript, Headless CMS',
        duration: '4 - 6 Weeks (Standard)',
        advice: 'Leverage Next.js static layouts for sub-second page delivery and headless CMS validation hooks.',
      };
    } else if (t === 'AI_SOLUTION') {
      return {
        tech: 'PyTorch, FastAPI, pgvector (PostgreSQL), AWS ECS, LangChain, Jose JWT',
        duration: '4 - 6 Months (Complex)',
        advice: 'Isolate GPU kubernetes nodes inside private VPC network architectures to conform to HIPAA compliance.',
      };
    } else if (t === 'WEB_APP') {
      return {
        tech: 'NestJS REST API Gateway, Next.js, PostgreSQL, Prisma Client, Redis Session Cache, Docker',
        duration: '3 - 4 Months (Comprehensive)',
        advice: 'Map connection pools inside Prisma client to survive compute scales, configure Redis cache stores.',
      };
    }
    return {
      tech: 'React 19, TypeScript, Tailwind CSS, Node.js API Gateway, Prisma DB Client, PostgreSQL',
      duration: '3 Months average',
      advice: 'Integrate shared workspaces config systems, verify candidate components compile inside Docker containers.',
    };
  };

  const getStatusColor = (s: Lead['status']) => {
    switch (s) {
      case 'NEW':
        return 'text-blue-400 bg-blue-900/30 border border-blue-800';
      case 'CONTACTED':
        return 'text-amber-400 bg-amber-900/30 border border-amber-800';
      case 'CONSULTATION_SCHEDULED':
        return 'text-purple-400 bg-purple-900/30 border border-purple-800';
      case 'PROPOSAL_SENT':
        return 'text-indigo-400 bg-indigo-900/30 border border-indigo-800';
      case 'NEGOTIATION':
        return 'text-pink-400 bg-pink-900/30 border border-pink-800';
      case 'CLOSED_WON':
        return 'text-emerald-400 bg-emerald-900/30 border border-emerald-800';
      case 'CLOSED_LOST':
        return 'text-rose-400 bg-rose-900/30 border border-rose-800';
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'HIGH') return 'text-red-400 bg-red-950/30 border border-red-900';
    if (p === 'MEDIUM') return 'text-amber-400 bg-amber-950/30 border border-amber-900';
    return 'text-green-400 bg-green-950/30 border border-green-900';
  };

  return (
    <main className="min-h-screen bg-[#080c14] text-gray-200 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <header className="border-b border-[#182335] bg-[#0c1220] py-4 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <Layers className="h-6 w-6 text-indigo-500 animate-pulse" />
          <h1 className="text-lg font-heading font-semibold text-gray-100 tracking-tight">
            HawkEdge <span className="text-indigo-400">Mission Control</span>
          </h1>
          <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono border border-indigo-900">
            CRM Console v1.0
          </span>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1a2338] text-sm text-indigo-400 transition border border-[#212f48]"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Ledger</span>
        </button>
      </header>

      {/* Main Grid Workspace */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left Side: Leads List panel */}
        <section className="col-span-4 border-r border-[#182335] bg-[#0c1220] flex flex-col min-h-[calc(100vh-69px)]">
          {/* Query Filters Head */}
          <div className="p-4 border-b border-[#182335] space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search leads, company, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141b2b] text-gray-200 pl-9 pr-4 py-2 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-[#212f48]"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-1.5">
              <div className="flex items-center space-x-1 bg-[#141b2b] rounded-lg px-1.5 border border-[#212f48]">
                <Filter className="h-3 w-3 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-[11px] text-gray-300 py-1.5 focus:outline-none w-full cursor-pointer"
                >
                  <option value="" className="bg-[#0c1220]">Status</option>
                  {PIPELINE_STAGES.map(s => (
                    <option key={s} value={s} className="bg-[#0c1220]">{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-[#141b2b] rounded-lg px-1.5 border border-[#212f48]">
                <Filter className="h-3 w-3 text-gray-500" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-transparent text-[11px] text-gray-300 py-1.5 focus:outline-none w-full cursor-pointer"
                >
                  <option value="" className="bg-[#0c1220]">Priority</option>
                  <option value="HIGH" className="bg-[#0c1220]">High</option>
                  <option value="MEDIUM" className="bg-[#0c1220]">Medium</option>
                  <option value="LOW" className="bg-[#0c1220]">Low</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-[#141b2b] rounded-lg px-1.5 border border-[#212f48]">
                <TrendingUp className="h-3 w-3 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[11px] text-gray-300 py-1.5 focus:outline-none w-full cursor-pointer"
                >
                  <option value="createdAt" className="bg-[#0c1220]">Newest</option>
                  <option value="leadScore" className="bg-[#0c1220]">Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Dynamic List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#151e2e]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 space-y-2">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="text-xs">Accessing PostgreSQL Ledger...</span>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No active consultation leads found.
              </div>
            ) : (
              leads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`p-4 cursor-pointer hover:bg-[#121a2a] transition duration-150 ${
                    selectedLeadId === l.id ? 'bg-[#152035] border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-medium text-sm text-gray-200">{l.fullName}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{l.companyName}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${getPriorityColor(l.leadPriority)}`}>
                      {l.leadPriority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${getStatusColor(l.status)}`}>
                      {l.status}
                    </span>
                    <div className="flex items-center space-x-1.5 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(l.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Side: Lead Details Inspector panel */}
        <section className="col-span-8 bg-[#090e18] overflow-y-auto flex flex-col min-h-[calc(100vh-69px)]">
          {!selectedLead ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-12">
              <Layers className="h-12 w-12 text-gray-700 mb-3" />
              <p className="text-sm font-heading">Select a diagnostic lead from the ledger to inspect pipeline details.</p>
            </div>
          ) : (
            <div className="p-6 space-y-6 flex-1">
              {/* Profile Card Header */}
              <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] shadow-sm flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-heading font-semibold text-gray-100">{selectedLead.fullName}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-400">
                    <div><span className="text-gray-500">Company:</span> {selectedLead.companyName}</div>
                    <div><span className="text-gray-500">Email:</span> {selectedLead.email}</div>
                    <div><span className="text-gray-500">Build Type:</span> <span className="font-mono text-indigo-300">{selectedLead.buildType}</span></div>
                    <div><span className="text-gray-500">Owner:</span> <span className="text-gray-300 font-medium">{selectedLead.assignedTo || 'Unassigned'}</span></div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-900/50">
                    <span className="text-xs text-indigo-300 uppercase tracking-widest font-mono">Lead Score</span>
                    <span className="text-lg font-mono font-bold text-indigo-400">{selectedLead.leadScore}</span>
                  </div>
                  <button
                    onClick={handleDeleteLead}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/40 text-xs text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Soft Delete</span>
                  </button>
                </div>
              </div>

              {/* Pipeline Progression Stepper */}
              <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Lead Status Pipeline Lifecycle</h3>
                
                {/* Visual Pipeline Bar */}
                <div className="flex items-center justify-between w-full relative py-4">
                  {PIPELINE_STAGES.map((s, idx) => {
                    const currentIdx = PIPELINE_STAGES.indexOf(selectedLead.status);
                    const isCompleted = idx < currentIdx;
                    const isActive = idx === currentIdx;

                    return (
                      <div key={s} className="flex flex-col items-center flex-1 z-10 relative">
                        <button
                          onClick={() => handleUpdateStatus(s)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                              : isCompleted
                              ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                              : 'bg-[#151c2c] border-[#25334c] text-gray-500 hover:border-gray-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                        </button>
                        <span className="text-[10px] mt-2 text-center font-medium max-w-[80px] truncate text-gray-400 block" title={s}>
                          {s.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dual grid: Recommendations & Actions */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left side: Recommendations */}
                <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200">Recommended Solution Architecture</h3>
                  </div>
                  {(() => {
                    const rec = getRecommendationSummary(selectedLead.buildType);
                    return (
                      <div className="space-y-3 text-xs">
                        <div className="bg-[#0b101c] p-3 rounded-lg border border-[#18233a]">
                          <span className="text-gray-500 uppercase tracking-widest font-mono text-[9px] block">Tech Stack Blueprint</span>
                          <p className="text-gray-300 font-medium mt-1 leading-relaxed">{rec.tech}</p>
                        </div>
                        <div className="bg-[#0b101c] p-3 rounded-lg border border-[#18233a]">
                          <span className="text-gray-500 uppercase tracking-widest font-mono text-[9px] block">Estimated Duration</span>
                          <p className="text-indigo-300 font-mono mt-1 font-semibold">{rec.duration}</p>
                        </div>
                        <div className="bg-[#0b101c] p-3 rounded-lg border border-[#18233a]">
                          <span className="text-gray-500 uppercase tracking-widest font-mono text-[9px] block">Architectural Advice</span>
                          <p className="text-gray-400 mt-1 leading-relaxed">{rec.advice}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right side: Actions / Owner & Add Note */}
                <div className="space-y-6">
                  {/* Assign Owner Box */}
                  <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-3">
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-sm font-semibold text-gray-200">Assign Ownership</h3>
                    </div>
                    <form onSubmit={handleAssignOwner} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Owner name or Staff ID..."
                        value={assigneeText}
                        onChange={(e) => setAssigneeText(e.target.value)}
                        className="flex-1 bg-[#0b101c] text-xs text-gray-300 px-3 py-2 rounded-lg focus:outline-none border border-[#1f2d48]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs rounded-lg text-white font-medium transition"
                      >
                        Assign
                      </button>
                    </form>
                  </div>

                  {/* Add Notes Box */}
                  <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-sm font-semibold text-gray-200">Append Internal Coordination Notes</h3>
                    </div>
                    <form onSubmit={handleAddNote} className="space-y-2">
                      <textarea
                        placeholder="Type notes from calls or diagnostics review..."
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full bg-[#0b101c] text-xs text-gray-300 p-3 rounded-lg focus:outline-none border border-[#1f2d48] resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!noteText.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-xs rounded-lg text-white font-medium transition"
                        >
                          Log Note
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Grid: Notes history & Activity Timeline */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Notes history thread */}
                <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200">Logged Notes Thread</h3>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                    {!selectedLead.internalNotes ? (
                      <p className="text-xs text-gray-500 italic p-4 text-center">No notes have been logged for this lead.</p>
                    ) : (
                      selectedLead.internalNotes.split('\n\n').map((n, idx) => {
                        const match = n.match(/^\[(.*?)\]:\s*(.*)/s);
                        const date = match ? match[1] : '';
                        const content = match ? match[2] : n;

                        return (
                          <div key={idx} className="bg-[#0b101c] p-3 rounded-lg border border-[#18233a] text-xs">
                            {date && <span className="text-[10px] text-gray-500 font-mono block mb-1">{new Date(date).toLocaleString()}</span>}
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right: Activity timeline */}
                <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200">Activity & Status Auditing Timeline</h3>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1 text-xs relative">
                    {activities.length === 0 ? (
                      <p className="text-xs text-gray-500 italic p-4 text-center">No auditing logs recorded.</p>
                    ) : (
                      activities.map((a) => (
                        <div key={a.id} className="flex items-start space-x-2 relative pl-2 border-l border-[#212f48] pb-1">
                          <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                              <span className="text-indigo-400 font-bold">{a.action.replace('LEAD_', '')}</span>
                              <span>{new Date(a.timestamp).toLocaleTimeString()}</span>
                            </div>
                            {a.action === 'LEAD_STATUS_UPDATED' && (
                              <p className="text-gray-300 mt-0.5">
                                Pipeline changed: <span className="text-gray-400">{a.details.oldStatus as string}</span> → <span className="text-indigo-300 font-medium">{a.details.newStatus as string}</span>
                              </p>
                            )}
                            {a.action === 'LEAD_ASSIGNED' && (
                              <p className="text-gray-300 mt-0.5">
                                Assigned to owner: <span className="text-indigo-300 font-medium">{(a.details.newAssignee as string) || 'None'}</span>
                              </p>
                            )}
                            {a.action === 'LEAD_NOTE_ADDED' && (
                              <p className="text-gray-400 mt-0.5 italic">
                                Note recorded: &quot;{a.details.noteSnippet as string}&quot;
                              </p>
                            )}
                            {a.action === 'LEAD_CREATED' && (
                              <p className="text-gray-300 mt-0.5">Discovery completed and ingested.</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Scheduled Consultations Ledger */}
              <div className="bg-[#101726] rounded-xl p-5 border border-[#1b273d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f2d48] pb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-gray-200">Scheduled Consultations Ledger</h3>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Prevention of Double-Bookings active</span>
                </div>

                {(!selectedLead.meetings || selectedLead.meetings.length === 0) ? (
                  <p className="text-xs text-gray-500 italic p-4 text-center">No consultation meetings scheduled for this lead.</p>
                ) : (
                  <div className="divide-y divide-[#182335] space-y-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {selectedLead.meetings.map((m: any) => (
                      <div key={m.id} className="pt-3 flex justify-between items-start text-xs gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-200">{m.title}</span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              m.status === 'SCHEDULED' ? 'bg-blue-900/40 text-blue-300 border border-blue-800' :
                              m.status === 'CONFIRMED' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-800' :
                              m.status === 'CANCELLED' ? 'bg-red-900/40 text-red-300 border border-red-800' :
                              m.status === 'COMPLETED' ? 'bg-green-900/40 text-green-300 border border-green-800' :
                              'bg-yellow-900/40 text-yellow-300 border border-yellow-800'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                          {m.purpose && <p className="text-gray-400 text-[11px]">Purpose: {m.purpose}</p>}
                          {m.notes && <p className="text-gray-500 text-[11px] italic">Notes: {m.notes}</p>}
                          <div className="flex items-center space-x-1.5 text-gray-500 text-[10px] font-mono">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span>{new Date(m.scheduledAt).toLocaleString()} ({m.durationMinutes} mins)</span>
                          </div>
                        </div>

                        {/* Status updates action buttons */}
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {m.status === 'SCHEDULED' && (
                            <>
                              <button
                                onClick={() => handleUpdateMeetingStatus(m.id, 'CONFIRMED')}
                                className="px-2.5 py-1 bg-indigo-900/40 hover:bg-indigo-800 text-[10px] font-mono rounded text-indigo-300 border border-indigo-750 transition"
                              >
                                CONFIRM
                              </button>
                              <button
                                onClick={() => handleUpdateMeetingStatus(m.id, 'CANCELLED')}
                                className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900 text-[10px] font-mono rounded text-red-400 border border-red-900/50 transition"
                              >
                                CANCEL
                              </button>
                            </>
                          )}
                          {m.status === 'CONFIRMED' && (
                            <>
                              <button
                                onClick={() => handleUpdateMeetingStatus(m.id, 'COMPLETED')}
                                className="px-2.5 py-1 bg-green-950/40 hover:bg-green-900 text-[10px] font-mono rounded text-green-400 border border-green-900/50 transition"
                              >
                                COMPLETE
                              </button>
                              <button
                                onClick={() => handleUpdateMeetingStatus(m.id, 'NO_SHOW')}
                                className="px-2.5 py-1 bg-yellow-950/40 hover:bg-yellow-900 text-[10px] font-mono rounded text-yellow-400 border border-yellow-900/50 transition"
                              >
                                NO SHOW
                              </button>
                              <button
                                onClick={() => handleUpdateMeetingStatus(m.id, 'CANCELLED')}
                                className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900 text-[10px] font-mono rounded text-red-400 border border-red-900/50 transition"
                              >
                                CANCEL
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
