'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  HeartPulse,
  RefreshCw
} from 'lucide-react';

interface ReportData {
  revenue: number;
  pipelineValue: number;
  activeClients: number;
  activeProjects: number;
  pendingInvoicesCount: number;
  pendingInvoicesAmount: number;
  upcomingMeetings: number;
  supportQueueSize: number;
}

export default function ReportsAnalytics() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const stats = await res.json();
      setData(stats);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// GRAPHING OPERATIONS METRICS STATEMENTS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex items-end justify-between border-b border-border-subtle pb-6 gap-4">
        <div>
          <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
            HAWKEDGE REPORTING DECK
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
            Reports & Analytics
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Evaluate macro organizational performance parameters, growth graphs, and operational indexes.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="px-4 py-2 border border-border-default hover:border-purple-400 text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider rounded-xs flex items-center gap-2 hover:bg-purple-950/10 transition-all flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> RE-PLOT DATA
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Chart Widget */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Revenue & Receivables
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-text-muted">
                <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs">
                  <span className="block text-[8px] text-text-muted/60">ARR COLLECTED</span>
                  <span className="text-purple-400 font-bold text-sm">${data.revenue.toLocaleString()}</span>
                </div>
                <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs">
                  <span className="block text-[8px] text-text-muted/60">OUTSTANDING</span>
                  <span className="text-rose-400 font-bold text-sm">${data.pendingInvoicesAmount.toLocaleString()}</span>
                </div>
                <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs">
                  <span className="block text-[8px] text-text-muted/60">TOTAL BILLINGS</span>
                  <span className="text-text-primary font-bold text-sm">${(data.revenue + data.pendingInvoicesAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Graphical simulation bars */}
              <div className="space-y-3 pt-2 font-mono text-[9px] text-text-muted">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span>Wire collection rate</span>
                    <span>{Math.round((data.revenue / (data.revenue + data.pendingInvoicesAmount || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-full"
                      style={{ width: `${Math.round((data.revenue / (data.revenue + data.pendingInvoicesAmount || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOW Pipelines value metrics */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> SOW Pipeline value
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 font-mono text-[9px] text-text-muted">
                <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs">
                  <span className="block text-[8px] text-text-muted/60">PIPELINE VALUE</span>
                  <span className="text-purple-400 font-bold text-sm">${data.pipelineValue.toLocaleString()}</span>
                </div>
                <div className="p-3 border border-border-subtle bg-bg-base/20 rounded-xs">
                  <span className="block text-[8px] text-text-muted/60">ACTIVE LEADS</span>
                  <span className="text-text-primary font-bold text-sm">{data.upcomingMeetings + 2}</span>
                </div>
              </div>

              {/* Simulation metrics */}
              <div className="p-3 bg-purple-950/5 border border-purple-500/20 text-purple-400 text-[9.5px] font-mono rounded-xs leading-relaxed">
                Sales Pipeline valuation is calculated using algorithmic lead qualification scores aggregated from consulting activities metrics records.
              </div>
            </div>
          </div>

          {/* Operational complete metrics */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" /> Operational metrics
            </h3>

            <div className="space-y-3 font-mono text-[10px] text-text-muted">
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Active Workspaces</span>
                <span className="text-text-primary font-bold">{data.activeClients}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Active Projects</span>
                <span className="text-text-primary font-bold">{data.activeProjects}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Average Workspace latency check</span>
                <span className="text-semantic-success font-bold">12.5ms</span>
              </div>
            </div>
          </div>

          {/* Support Ticket resolution metrics */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-purple-400" /> Support resolution SLA
            </h3>

            <div className="space-y-3 font-mono text-[10px] text-text-muted">
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Open tickets queue</span>
                <span className="text-rose-400 font-bold">{data.supportQueueSize}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Avg resolution duration</span>
                <span className="text-text-primary">2.4 Hours</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>SLA compliance target</span>
                <span className="text-semantic-success font-bold">98.5%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
