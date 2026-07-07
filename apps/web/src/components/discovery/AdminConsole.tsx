import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, Layers, Sparkles, Cpu, GraduationCap, UserCheck } from 'lucide-react';

interface LeadBrief {
  complexity: string;
  timeline: string;
  budget: string;
  goal: string;
}

interface LeadCRMEntry {
  timestamp: string;
  leadName: string;
  company: string;
  email: string;
  buildType: string;
  leadScore: number;
  leadPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  briefSummary: LeadBrief;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  rawAnswers: Record<string, any>;
}

export function AdminConsole() {
  const [leads, setLeads] = useState<LeadCRMEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/consultation');
      if (!res.ok) {
        throw new Error('Failed to retrieve consultation stream.');
      }
      const data = await res.json();
      setLeads(data.leads || []);
      if (data.leads && data.leads.length > 0 && selectedLeadIndex === null) {
        setSelectedLeadIndex(0);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unknown network error.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getBuildTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AI_SOLUTION':
        return Cpu;
      case 'WEB_APP':
        return Layers;
      case 'WEBSITE':
        return Sparkles;
      case 'PARTNERSHIP':
        return GraduationCap;
      default:
        return UserCheck;
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'HIGH_PRIORITY') return lead.leadPriority === 'HIGH';
    return lead.buildType.toUpperCase() === filterType;
  });

  const selectedLead = selectedLeadIndex !== null && filteredLeads[selectedLeadIndex] 
    ? filteredLeads[selectedLeadIndex] 
    : null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 font-body">
      
      {/* Sidebar - Leads Ingestion List */}
      <div className="lg:col-span-5 flex flex-col gap-4 border border-border-default bg-bg-surface/20 p-4">
        
        {/* Controls */}
        <div className="flex flex-col gap-3 pb-4 border-b border-border-default">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-brand-primary tracking-widest uppercase flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> TELEMETRY INGESTION MATRIX
            </span>
            
            <button 
              onClick={fetchLeads} 
              disabled={loading}
              className="text-text-muted hover:text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary p-1 border border-border-subtle rounded-sm"
              aria-label="Refresh telemetry data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 font-mono text-[9px]">
            {['ALL', 'HIGH_PRIORITY', 'WEBSITE', 'AI_SOLUTION', 'WEB_APP', 'DASHBOARD', 'PARTNERSHIP'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setSelectedLeadIndex(0);
                }}
                className={`px-2 py-0.5 border transition-colors focus:outline-none ${
                  filterType === t 
                    ? 'border-brand-primary text-brand-primary bg-bg-elevated' 
                    : 'border-border-subtle text-text-muted hover:text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-grow overflow-y-auto max-h-[500px] flex flex-col gap-2">
          {loading && leads.length === 0 ? (
            <div className="text-center py-12 font-mono text-xs text-text-muted">
              <span>// STREAMING Telemetry Logs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 font-mono text-xs text-semantic-danger">
              <span>// ERROR: {error}</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 font-mono text-xs text-text-muted">
              <span>// NO INGESTED LEADS FOUND</span>
            </div>
          ) : (
            filteredLeads.map((lead, idx) => {
              const IconComponent = getBuildTypeIcon(lead.buildType);
              const isSelected = selectedLeadIndex === idx;
              
              return (
                <button
                  key={`${lead.timestamp}-${idx}`}
                  onClick={() => setSelectedLeadIndex(idx)}
                  className={`w-full p-4 border text-left transition-all focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                    isSelected 
                      ? 'border-brand-primary bg-bg-elevated/40' 
                      : 'border-border-subtle bg-bg-surface/5 hover:border-border-default'
                  }`}
                >
                  <div className="flex justify-between items-baseline gap-2 mb-2 font-mono text-[10px]">
                    <span className="text-text-muted">
                      {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`px-1.5 py-0.5 border ${
                      lead.leadPriority === 'HIGH' 
                        ? 'border-semantic-danger text-semantic-danger' 
                        : 'border-text-placeholder text-text-muted'
                    }`}>
                      {lead.leadPriority} ({lead.leadScore} pts)
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-text-primary mb-1 truncate">
                    {lead.leadName}
                  </h4>
                  <p className="text-xs text-text-secondary truncate mb-2">
                    {lead.company}
                  </p>

                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-brand-primary">
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{lead.buildType}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Pane - Details Inspection Inspector */}
      <div className="lg:col-span-7 border border-border-default bg-bg-base/80 p-6 flex flex-col gap-6 relative min-h-[500px]">
        {selectedLead ? (
          <>
            <div className="absolute top-0 right-0 p-3 border-l border-b border-border-default font-mono text-[9px] text-text-muted">
              INSPECTOR_ACTIVE // MODE: TELEMETRY
            </div>

            {/* Header */}
            <div className="border-b border-border-subtle pb-4">
              <span className="font-mono text-[9px] text-brand-primary uppercase block mb-1">
                // TARGET COORDINATES
              </span>
              <h3 className="font-heading font-extrabold text-xl text-text-primary">
                {selectedLead.leadName}
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Company: <span className="text-text-secondary font-semibold">{selectedLead.company}</span> | Email: <span className="text-text-secondary font-semibold">{selectedLead.email}</span>
              </p>
            </div>

            {/* Ingested metrics cards */}
            <div className="grid grid-cols-3 gap-4 font-mono text-center text-xs">
              <div className="border border-border-subtle p-3 bg-bg-surface/30">
                <span className="text-text-muted text-[9px] block mb-1">PRIORITY</span>
                <span className={`font-bold ${selectedLead.leadPriority === 'HIGH' ? 'text-semantic-danger' : 'text-text-primary'}`}>
                  {selectedLead.leadPriority}
                </span>
              </div>
              <div className="border border-border-subtle p-3 bg-bg-surface/30">
                <span className="text-text-muted text-[9px] block mb-1">SCORE</span>
                <span className="font-bold text-text-primary">
                  {selectedLead.leadScore} / 100
                </span>
              </div>
              <div className="border border-border-subtle p-3 bg-bg-surface/30">
                <span className="text-text-muted text-[9px] block mb-1">COMPLEXITY</span>
                <span className="font-bold text-brand-primary">
                  {selectedLead.briefSummary.complexity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Brief Specification Goal */}
            <div className="border border-border-subtle p-4 bg-bg-surface/20">
              <span className="font-mono text-[9px] text-brand-primary block mb-2">// SPECIFICATION SYNOPSIS</span>
              <p className="text-xs text-text-secondary leading-relaxed font-body">
                {selectedLead.briefSummary.goal}
              </p>
            </div>

            {/* Raw JSON telemetry */}
            <div className="flex-grow flex flex-col min-h-[200px]">
              <span className="font-mono text-[9px] text-text-muted mb-2 block">// RAW INGESTION ANSWERS DB DUMP</span>
              <div className="flex-grow bg-bg-subtle border border-border-subtle p-4 rounded-sm font-mono text-[10px] overflow-auto max-h-[250px] text-text-secondary select-all">
                <pre>{JSON.stringify(selectedLead.rawAnswers, null, 2)}</pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center font-mono text-xs text-text-muted">
            <span>// SELECT AN INGESTED LEAD FROM THE SIDEBAR TO INSPECT METRICS</span>
          </div>
        )}
      </div>

    </div>
  );
}
