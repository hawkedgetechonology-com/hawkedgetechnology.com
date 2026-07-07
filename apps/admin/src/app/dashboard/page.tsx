'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Target,
  Users,
  FolderKanban,
  LifeBuoy,
  Activity,
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  revenue: number;
  pipelineValue: number;
  activeClients: number;
  activeProjects: number;
  pendingInvoicesCount: number;
  pendingInvoicesAmount: number;
  upcomingMeetings: number;
  supportQueueSize: number;
  systemHealth: string;
}

interface SystemHealthData {
  dbStatus: string;
  dbLatencyMs: number;
  redisStatus: string;
  redisLatencyMs: number;
  storageStatus: string;
  storageLatencyMs: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      companyName: string | null;
    } | null;
  };
}

interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  details: Record<string, unknown> | null;
  user: {
    email: string;
  } | null;
}

export default function ExecutiveDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, healthRes, ticketsRes, logsRes] = await Promise.all([
        fetch('/api/dashboard').then((res) => res.json()),
        fetch('/api/system/health').then((res) => res.json()),
        fetch('/api/support').then((res) => res.json()),
        fetch('/api/system/logs').then((res) => res.json())
      ]);

      setStats(statsRes);
      setHealth(healthRes);
      setTickets(Array.isArray(ticketsRes.tickets) ? ticketsRes.tickets.slice(0, 5) : []);
      setLogs(Array.isArray(logsRes) ? logsRes.slice(0, 8) : []);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load executive metrics:', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// HARNESSING HAWKEDGE MASTER COCKPIT METRICS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
            HAWKEDGE OPERATIONS MISSION BRIEFING
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
            Executive Command Cockpit
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Central dashboard monitoring global ARR, sales pipelines, client environments, and service diagnostics.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 border border-border-default hover:border-purple-400 text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider rounded-xs flex items-center gap-2 hover:bg-purple-950/10 transition-all self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REFRESH COMMAND
        </button>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue (ARR)', value: `$${stats.revenue.toLocaleString()}`, sub: 'Completed Wire Audits', icon: TrendingUp },
            { label: 'Lead Pipeline Value', value: `$${stats.pipelineValue.toLocaleString()}`, sub: 'Active SOW Proposals', icon: Target },
            { label: 'Active Clients', value: stats.activeClients, sub: 'Provisioned Workspaces', icon: Users },
            { label: 'Project Operations', value: stats.activeProjects, sub: 'Active Milestone Sprints', icon: FolderKanban },
          ].map((card, idx) => (
            <div key={idx} className="border border-border-subtle bg-bg-surface/35 p-5 rounded-md relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-border-subtle group-hover:bg-purple-500 transition-colors" />
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">{card.label}</span>
                <card.icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-text-primary mb-1">
                {card.value}
              </div>
              <span className="font-mono text-[8px] text-text-muted/65 uppercase tracking-wide">{card.sub}</span>
            </div>
          ))}
        </div>
      )}

      {/* Secondary Metrics & Quick Actions */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Outstanding Balance', value: `$${stats.pendingInvoicesAmount.toLocaleString()}`, sub: `${stats.pendingInvoicesCount} invoices pending payment`, link: '/finance' },
            { label: 'Upcoming Consultations', value: stats.upcomingMeetings, sub: 'Next 7 days calendars', link: '/crm' },
            { label: 'Support Queue Size', value: stats.supportQueueSize, sub: 'Tickets requiring analyst attention', link: '/support' },
          ].map((metric, idx) => (
            <Link
              href={metric.link}
              key={idx}
              className="border border-border-subtle bg-bg-surface/30 p-4 rounded-md hover:border-purple-400/50 transition-all flex justify-between items-center group"
            >
              <div>
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider block mb-1">{metric.label}</span>
                <div className="font-mono text-lg font-bold text-text-primary">{metric.value}</div>
                <span className="font-sans text-[10px] text-text-muted mt-0.5 block">{metric.sub}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}

      {/* Primary Cockpit Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Diagnostics and Audit Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audit Logs */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Master Audit Logs
                </h3>
              </div>
              <Link href="/system" className="font-mono text-[9px] text-purple-400 hover:underline">
                DIAGNOSTICS SCREEN
              </Link>
            </div>

            {logs.length === 0 ? (
              <p className="font-mono text-[9px] text-text-muted text-center py-6">// LOGGER LOG CLEAR</p>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 font-mono text-[9.5px] text-text-muted">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 border border-border-subtle/30 bg-bg-base/20 rounded-sm hover:border-purple-400/20 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-text-primary font-bold uppercase">{log.action}</span>
                      <span className="text-[8px] text-text-muted/65">
                        {new Date(log.createdAt).toLocaleDateString()} &bull; {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[9px] text-text-secondary leading-relaxed">
                      Details: {JSON.stringify(log.details)}
                    </p>
                    <span className="block text-[8px] text-text-muted/50 mt-1 uppercase">
                      TRIGGERED BY: {log.user?.email || 'SYSTEM DAEMON'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Support queue & System diagnostics */}
        <div className="space-y-6">
          {/* System Latency Diagnostics */}
          {health && (
            <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-border-subtle pb-3">
                <Database className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  System Latency Telemetry
                </h3>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-text-muted">
                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
                  <span className="uppercase">PostgreSQL Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.dbStatus}</span>
                    <span className="text-[9px] text-text-muted/60">({health.dbLatencyMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
                  <span className="uppercase">Redis Cluster Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.redisStatus}</span>
                    <span className="text-[9px] text-text-muted/60">({health.redisLatencyMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <span className="uppercase">Asset Storage Latency</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.storageStatus}</span>
                    <span className="text-[9px] text-text-muted/60">({health.storageLatencyMs}ms)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support queue */}
          <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
            <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Support Queue (Open)
                </h3>
              </div>
              <Link href="/support" className="font-mono text-[9px] text-purple-400 hover:underline">
                OPEN QUEUE
              </Link>
            </div>

            {tickets.length === 0 ? (
              <p className="font-mono text-[9px] text-text-muted text-center py-6">// SUPPORT QUEUE RESOLVED</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 border border-border-subtle/30 bg-bg-base/20 rounded-sm">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-mono text-[7px] border px-1.5 py-0.5 rounded-full ${
                        t.priority === 'URGENT' || t.priority === 'HIGH'
                          ? 'border-semantic-danger/35 text-semantic-danger bg-semantic-danger-bg/10'
                          : 'border-border-default text-text-muted bg-bg-base'
                      }`}>
                        {t.priority}
                      </span>
                      <span className="font-mono text-[8px] text-text-muted">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-xs text-text-primary truncate">
                      {t.subject}
                    </h4>
                    <p className="font-mono text-[9px] text-text-muted mt-1.5 truncate">
                      Client: {t.user.profile?.firstName || 'Client'} ({t.user.profile?.companyName || 'Corporate'})
                    </p>
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
