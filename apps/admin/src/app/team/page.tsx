'use client';

import React, { useState, useEffect } from 'react';
import {
  Users2,
  Shield,
  Mail
} from 'lucide-react';

interface Employee {
  id: string;
  email: string;
  rank: string;
  status: string;
  profile: {
    firstName: string;
    lastName: string;
    companyName: string | null;
  } | null;
}

export default function TeamManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit employee state
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editRank, setEditRank] = useState('');
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTeamData = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setEmployees(data.employees);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleSaveRoleClearance = async (userId: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          rank: editRank,
          companyName: editRole,
        }),
      });
      if (res.ok) {
        setEditingEmployeeId(null);
        fetchTeamData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// DIALING INTERNAL ROLES REGISTRY...</span>
      </div>
    );
  }

  const ranks = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MENTOR', 'TRAINER', 'STUDENT', 'CLIENT', 'GUEST'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          INTERNAL CLEARANCE REGISTRY
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Team Management
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Set team ranks, evaluate system access credentials, and update roles clearances indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Employees Listing */}
        <div className="lg:col-span-8 border border-border-subtle bg-bg-surface/35 p-6 rounded-md">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4 flex items-center gap-2">
            <Users2 className="w-4 h-4 text-purple-400" /> Active Staff Registry
          </h3>

          <div className="divide-y divide-border-subtle/30 overflow-y-auto max-h-[550px] pr-2 font-mono text-[10px] text-text-muted">
            {employees.map((emp) => {
              const isEditing = editingEmployeeId === emp.id;
              return (
                <div key={emp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">
                        {emp.profile?.firstName} {emp.profile?.lastName}
                      </span>
                      <span className="text-[8px] bg-purple-950/20 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-xs uppercase">
                        {emp.rank}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-text-muted flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-text-muted" /> {emp.email}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <select
                        value={editRank}
                        onChange={(e) => setEditRank(e.target.value)}
                        className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-2 py-1"
                      >
                        {ranks.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <input
                        placeholder="Custom Title"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-2 py-1 w-24"
                      />
                      <button
                        onClick={() => handleSaveRoleClearance(emp.id)}
                        disabled={saving}
                        className="px-2 py-1 bg-purple-500 text-white text-[8px] uppercase font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 text-right flex-shrink-0 text-text-muted">
                      <div>
                        <span className="block text-[8px] text-text-muted/50">OPERATIONAL STATUS</span>
                        <span className="text-semantic-success font-bold">{emp.status}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-text-muted/50">CUSTOM TITLE</span>
                        <span className="text-text-primary">{emp.profile?.companyName || 'Staff Member'}</span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingEmployeeId(emp.id);
                          setEditRank(emp.rank);
                          setEditRole(emp.profile?.companyName || '');
                        }}
                        className="text-purple-400 hover:underline text-[8px] uppercase font-bold"
                      >
                        Edit Clearances
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Security Clearance Summary */}
        <div className="lg:col-span-4 border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Security levels
          </h3>
          <p className="font-sans text-[11px] text-text-muted">
            Role clearances hierarchy:
          </p>

          <div className="space-y-3 font-mono text-[9px] text-text-muted leading-relaxed bg-bg-base/30 p-4 border border-border-subtle/50 rounded-sm">
            <div>
              <span className="text-text-primary font-bold">SUPER_ADMIN</span>
              <p className="text-[8px] text-text-muted">Full write permission overrides for environments, DB, and billing keys.</p>
            </div>
            <div>
              <span className="text-text-primary font-bold">ADMIN / HR</span>
              <p className="text-[8px] text-text-muted">Access lead registries, generate SOW invoices, resolve tickets.</p>
            </div>
            <div>
              <span className="text-text-primary font-bold">MENTOR / TRAINER</span>
              <p className="text-[8px] text-text-muted">Instruct platform courses pipelines, check submissions logs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
