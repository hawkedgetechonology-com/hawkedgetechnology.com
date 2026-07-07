'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Activity,
  Key,
  Trash
} from 'lucide-react';

interface SystemHealth {
  dbStatus: string;
  dbLatencyMs: number;
  redisStatus: string;
  redisLatencyMs: number;
  storageStatus: string;
  storageLatencyMs: number;
  env: string;
  nodeVersion: string;
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

interface ApiKey {
  id: string;
  keyLabel: string;
  apiKeySecret: string;
  createdAt: string;
}

export default function SystemDiagnostics() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'key_1', keyLabel: 'Production Billing Webhook', apiKeySecret: 'hk_live_51M2O...z98Y', createdAt: '2026-06-01T12:00:00Z' },
    { id: 'key_2', keyLabel: 'Canary SLA Telemetry Integration', apiKeySecret: 'hk_live_39Xp...w41T', createdAt: '2026-07-02T15:30:00Z' }
  ]);
  const [loading, setLoading] = useState(true);

  // Api key generator states
  const [newKeyLabel, setNewKeyLabel] = useState('');

  const fetchDiagnostics = async () => {
    try {
      const [healthRes, logsRes] = await Promise.all([
        fetch('/api/system/health').then((res) => res.json()),
        fetch('/api/system/logs').then((res) => res.json())
      ]);

      setHealth(healthRes);
      setLogs(logsRes);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel.trim()) return;

    const randomSecret = `hk_live_${Math.random().toString(36).substring(2, 8)}${Math.random().toString(36).substring(2, 8)}`;
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      keyLabel: newKeyLabel,
      apiKeySecret: `${randomSecret.substring(0, 8)}...${randomSecret.substring(12, 16)}`,
      createdAt: new Date().toISOString(),
    };

    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyLabel('');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// RUNNING SYSTEMS COMPILING DIAGNOSTICS CHECK...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex items-end justify-between border-b border-border-subtle pb-6 gap-4">
        <div>
          <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
            HAWKEDGE NODE DIAGNOSTICS
          </span>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
            System Diagnostics
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Evaluate environment latencies, connection diagnostics check parameters, and active API keys directories.
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          className="px-4 py-2 border border-border-default hover:border-purple-400 text-text-secondary hover:text-text-primary font-mono text-[10px] uppercase tracking-wider rounded-xs flex items-center gap-2 hover:bg-purple-950/10 transition-all flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> RUN DIAGNOSTICS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Health & API Keys */}
        <div className="lg:col-span-5 space-y-6">
          {/* Health Telemetry Card */}
          {health && (
            <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" /> Environment Health Telemetry
              </h3>

              <div className="space-y-3 font-mono text-[10px] text-text-muted">
                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
                  <span>POSTGRESQL STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.dbStatus}</span>
                    <span className="text-[8.5px] text-text-muted">({health.dbLatencyMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
                  <span>REDIS CACHE TELEMETRY</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.redisStatus}</span>
                    <span className="text-[8.5px] text-text-muted">({health.redisLatencyMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
                  <span>ASSET INGESTION STORAGE</span>
                  <div className="flex items-center gap-2">
                    <span className="text-semantic-success font-bold">{health.storageStatus}</span>
                    <span className="text-[8.5px] text-text-muted">({health.storageLatencyMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>ENVIRONMENT</span>
                  <span className="text-text-primary font-bold">{health.env}</span>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Panel */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" /> API Access Keys
            </h3>

            <div className="space-y-3 font-mono text-[10px]">
              {apiKeys.map((k) => (
                <div key={k.id} className="p-3 border border-border-subtle bg-bg-base/30 rounded-xs flex justify-between items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-text-primary font-bold block">{k.keyLabel}</span>
                    <span className="text-[8.5px] text-purple-400 block mt-0.5">{k.apiKeySecret}</span>
                  </div>
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-1 border border-border-default text-text-muted hover:text-red-400 hover:border-red-950 transition-colors rounded-xs"
                    title="Revoke access key"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Key generator form */}
            <form onSubmit={handleGenerateKey} className="pt-2 flex gap-2 font-mono text-[9px]">
              <input
                placeholder="Key designation label..."
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                className="bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none flex-1"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold uppercase rounded-xs"
              >
                GENERATE KEY
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Audit logs list */}
        <div className="lg:col-span-7 border border-border-subtle bg-bg-surface/35 p-6 rounded-md">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> System Audit Ledger
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 font-mono text-[9px] text-text-muted">
            {logs.map((log) => (
              <div key={log.id} className="p-3 border border-border-subtle/50 bg-bg-base/20 rounded-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-text-primary font-bold uppercase">{log.action}</span>
                  <span className="text-[8px] text-text-muted/65">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[9px] text-text-secondary leading-relaxed mt-1">
                  Details: {JSON.stringify(log.details)}
                </p>
                <span className="block text-[8px] text-text-muted/50 mt-1 uppercase font-semibold">
                  Operator: {log.user?.email || 'SYSTEM DAEMON'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
