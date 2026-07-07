'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Receipt,
  Ticket,
  Bell,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
  };
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalInvoiced: number;
    totalPaid: number;
    outstanding: number;
    openTickets: number;
    unreadNotifications: number;
  };
  projects: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    milestonesTotal: number;
    milestonesCompleted: number;
  }>;
  activeMilestones: Array<{
    id: string;
    title: string;
    status: string;
    owner: string;
    dateLabel: string;
    completion: number;
  }>;
  nextDueInvoice: {
    id: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    status: string;
  } | null;
  recentActivity: Array<{
    id: string;
    action: string;
    details: Record<string, unknown> | null;
    createdAt: string;
  }>;
  recentTickets: Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/studio/dashboard')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// FETCHING WORKSPACE STATUS...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-red-500/20 bg-semantic-danger-bg/20 p-6 rounded-md text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-semantic-danger mx-auto mb-3" />
        <h3 className="font-heading font-bold text-text-primary text-sm mb-1">Ingestion Failed</h3>
        <p className="font-mono text-[10px] text-text-muted">Could not load the client operations ledger.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-border-subtle bg-bg-surface/30 p-6 md:p-8 rounded-md backdrop-blur-sm">
        <div>
          <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
            HAWKEDGE STUDIO OPERATIONAL BRIEFING
          </span>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
            Welcome back, {data.user.firstName || 'Partner'}
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Systems console for <span className="text-text-primary">{data.user.companyName}</span> dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/support"
            className="px-4 py-2 font-mono text-[9px] tracking-wider uppercase border border-border-default text-text-secondary hover:text-text-primary hover:border-brand-primary transition-all rounded-xs"
          >
            CREATE SUPPORT TICKET
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 font-mono text-[9px] tracking-wider uppercase bg-brand-primary text-white hover:bg-brand-hover transition-all rounded-xs flex items-center gap-1.5"
          >
            ACTIVE PROJECTS <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: data.stats.activeProjects, icon: FolderKanban, color: 'text-brand-primary' },
          { label: 'Unread Alerts', value: data.stats.unreadNotifications, icon: Bell, color: 'text-brand-primary' },
          { label: 'Open Support Tickets', value: data.stats.openTickets, icon: Ticket, color: 'text-amber-400' },
          { label: 'Outstanding Balance', value: `$${data.stats.outstanding.toLocaleString()}`, icon: Receipt, color: 'text-semantic-danger' },
        ].map((kpi, idx) => (
          <div key={idx} className="border border-border-subtle bg-bg-surface/35 p-5 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">{kpi.label}</span>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Project Status Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-primary" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Systems Development Status
                </h3>
              </div>
              <Link href="/projects" className="font-mono text-[9px] text-brand-primary hover:underline flex items-center gap-1">
                ALL PROJECTS <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {data.projects.length === 0 ? (
              <div className="text-center py-10 font-mono text-[10px] text-text-muted">
                // NO PROJECTS IN PROGRESS
              </div>
            ) : (
              <div className="space-y-4">
                {data.projects.map((project) => (
                  <div key={project.id} className="border border-border-subtle/50 bg-bg-base/40 p-4 rounded-sm hover:border-brand-primary/55 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading font-bold text-xs text-text-primary">
                        {project.name}
                      </h4>
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
                        project.status === 'IN_PROGRESS'
                          ? 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary'
                          : 'border-semantic-success/30 bg-semantic-success-bg/10 text-semantic-success'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-1">
                      <span>Progress</span>
                      <span>{project.progress}% ({project.milestonesCompleted}/{project.milestonesTotal} Milestones)</span>
                    </div>

                    <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Milestones Grid */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border-subtle pb-3">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                Active Milestones Pipeline
              </h3>
            </div>

            {data.activeMilestones.length === 0 ? (
              <div className="text-center py-10 font-mono text-[10px] text-text-muted">
                // PIPELINE CLEAR: ALL COMMITTED MILESTONES DEPLOYED
              </div>
            ) : (
              <div className="space-y-3">
                {data.activeMilestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 border border-border-subtle/30 bg-bg-base/20 rounded-sm">
                    <div className="min-w-0 flex-1 pr-4">
                      <h4 className="font-heading font-semibold text-xs text-text-primary truncate">
                        {milestone.title}
                      </h4>
                      <span className="font-mono text-[9px] text-text-muted">
                        OWNER: {milestone.owner} &bull; {milestone.dateLabel}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-[9px] text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-2 py-1 rounded-xs">
                        {milestone.completion}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Billing & Activity */}
        <div className="space-y-6">
          {/* Outstanding Invoice Card */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border-subtle pb-3">
              <Receipt className="w-4 h-4 text-brand-primary" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                Commercial Summary
              </h3>
            </div>

            {data.nextDueInvoice ? (
              <div className="space-y-4">
                <div className="p-4 border border-semantic-warning/20 bg-semantic-warning-bg/10 rounded-sm">
                  <span className="font-mono text-[9px] text-amber-500 uppercase tracking-wide">
                    Outstanding Invoice Due
                  </span>
                  <div className="font-mono text-lg font-bold text-text-primary mt-1">
                    ${data.nextDueInvoice.amount.toLocaleString()}
                  </div>
                  <p className="font-mono text-[10px] text-text-muted mt-0.5">
                    No: {data.nextDueInvoice.invoiceNumber} &bull; Due: {new Date(data.nextDueInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href="/invoices"
                  className="w-full text-center block py-2 border border-border-default text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider hover:bg-bg-hover transition-colors rounded-xs"
                >
                  SETTLE INVOICES
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 font-mono text-[10px] text-text-muted">
                // ALL INVOICES SETTLED: ACTIVE BALANCE = $0.00
              </div>
            )}
          </div>

          {/* Support Ticket Quick Look */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-primary" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Support Desks
                </h3>
              </div>
              <Link href="/support" className="font-mono text-[9px] text-brand-primary hover:underline">
                OPEN DESK
              </Link>
            </div>

            {data.recentTickets.length === 0 ? (
              <div className="text-center py-6 font-mono text-[10px] text-text-muted">
                // SYSTEM LOG: NO ACTIVE TICKETS
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 border border-border-subtle/30 bg-bg-base/20 rounded-sm flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="font-heading font-medium text-xs text-text-primary truncate">
                        {ticket.subject}
                      </h4>
                      <span className="font-mono text-[9px] text-text-muted">
                        Priority: {ticket.priority}
                      </span>
                    </div>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded-xs ${
                      ticket.status === 'OPEN'
                        ? 'border-blue-500/30 text-blue-400 bg-blue-950/20'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'border-yellow-500/30 text-yellow-400 bg-yellow-950/20'
                        : 'border-green-500/30 text-green-400 bg-green-950/20'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Operations Audit Feed */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-border-subtle pb-3">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                Activity Ledger
              </h3>
            </div>

            {data.recentActivity.length === 0 ? (
              <div className="text-center py-6 font-mono text-[10px] text-text-muted">
                // NO RECENT OPERATIONS LOGGED
              </div>
            ) : (
              <div className="space-y-3 font-mono text-[10px] text-text-muted">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-2">
                    <span className="text-brand-primary">&bull;</span>
                    <div>
                      <span className="text-text-secondary">{activity.action}</span>
                      <span className="block text-[8px] text-text-muted/65 mt-0.5">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
