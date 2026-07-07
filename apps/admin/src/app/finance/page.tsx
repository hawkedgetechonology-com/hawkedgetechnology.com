'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Plus
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  paymentNotes: string | null;
  createdAt: string;
  project: {
    name: string;
    client: {
      email: string;
      profile: {
        firstName: string;
        lastName: string;
        companyName: string | null;
      } | null;
    };
  };
}

interface ProjectList {
  id: string;
  name: string;
}

export default function FinanceCockpit() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<ProjectList[]>([]);
  const [stats, setStats] = useState({
    totalInvoiced: 0,
    totalPaid: 0,
    outstanding: 0,
    monthlyForecast: 0,
    quarterlyForecast: 0,
  });
  const [loading, setLoading] = useState(true);

  // New Invoice Form State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState('UNPAID');
  const [creating, setCreating] = useState(false);

  // Status Edit State
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchFinanceData = async () => {
    try {
      const [finRes, projRes] = await Promise.all([
        fetch('/api/finance').then((res) => res.json()),
        fetch('/api/projects').then((res) => res.json())
      ]);

      setInvoices(finRes.invoices);
      setStats(finRes.stats);
      interface ProjectItem {
        id: string;
        name: string;
      }
      setProjects(projRes.map((p: ProjectItem) => ({ id: p.id, name: p.name })));
      if (projRes.length > 0) {
        setSelectedProjectId(projRes[0].id);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !amount || !dueDate) return;
    setCreating(true);

    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          amount,
          dueDate,
          status: invoiceStatus,
          paymentNotes,
        }),
      });
      if (res.ok) {
        setAmount('');
        setDueDate('');
        setPaymentNotes('');
        setInvoiceStatus('UNPAID');
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleSaveInvoiceStatus = async (invoiceId: string) => {
    try {
      const res = await fetch('/api/finance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          status: editStatus,
          paymentNotes: editNotes,
        }),
      });
      if (res.ok) {
        setEditingInvoiceId(null);
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// SYNCING HAWKEDGE FINANCE REGISTRIES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          FINANCIAL OPERATIONS CONSOLE
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Finance & Invoicing
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Monitor wire audits, issue SOW invoices statements, and inspect growth forecasting reports.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoiced value', value: `$${stats.totalInvoiced.toLocaleString()}`, color: 'text-text-primary' },
          { label: 'Settled Payments (ARR)', value: `$${stats.totalPaid.toLocaleString()}`, color: 'text-purple-400' },
          { label: 'Outstanding Balance', value: `$${stats.outstanding.toLocaleString()}`, color: 'text-rose-400' },
          { label: 'ARR Forecast (Growth)', value: `$${stats.monthlyForecast.toLocaleString()}`, color: 'text-purple-400' },
        ].map((card, idx) => (
          <div key={idx} className="border border-border-subtle bg-bg-surface/35 p-5 rounded-md">
            <span className="font-mono text-[9px] text-text-muted uppercase block mb-3">{card.label}</span>
            <div className={`font-mono text-xl sm:text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Finance Grid Splitting Invoice List & Invoice Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Invoice listing */}
        <div className="lg:col-span-8 border border-border-subtle bg-bg-surface/35 p-6 rounded-md">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
            Accounts Billing Statements
          </h3>

          <div className="divide-y divide-border-subtle/30 overflow-y-auto max-h-[500px] pr-2">
            {invoices.map((inv) => {
              const isEditing = editingInvoiceId === inv.id;
              return (
                <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">{inv.invoiceNumber}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 border rounded-full ${
                        inv.status === 'PAID'
                          ? 'border-semantic-success/20 text-semantic-success bg-semantic-success-bg/10'
                          : 'border-semantic-danger/20 text-semantic-danger bg-semantic-danger-bg/10'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-text-muted">
                      Project: {inv.project.name} &bull; Client: {inv.project.client.profile?.companyName || 'Corporate'}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-2 py-1"
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                      </select>
                      <input
                        placeholder="Payment notes"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="bg-bg-surface border border-border-subtle text-text-primary text-[8px] px-2 py-1"
                      />
                      <button
                        onClick={() => handleSaveInvoiceStatus(inv.id)}
                        className="px-2 py-1 bg-purple-500 text-white text-[8px] uppercase font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 text-right flex-shrink-0 text-text-muted">
                      <div>
                        <span className="block text-[8px] text-text-muted/50">DUE DATE</span>
                        <span className="text-text-primary">{new Date(inv.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-text-muted/50">AMOUNT</span>
                        <span className="text-text-primary font-bold">${inv.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingInvoiceId(inv.id);
                            setEditStatus(inv.status);
                            setEditNotes(inv.paymentNotes || '');
                          }}
                          className="text-purple-400 hover:underline text-[8px] uppercase font-bold"
                        >
                          Audit
                        </button>
                        <a
                          href={`/api/proposals/${inv.id}/pdf`} // redirect to PDF route
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted hover:text-text-primary"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Invoice Generator */}
        <div className="lg:col-span-4 border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
          <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
            Generate invoice statement
          </h3>

          <form onSubmit={handleCreateInvoice} className="space-y-4 font-mono text-[9px]">
            <div>
              <label className="text-text-muted block mb-1 uppercase text-[8px]">Select Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-text-muted block mb-1 uppercase text-[8px]">Billing Amount ($)</label>
              <input
                type="number"
                placeholder="Amount in USD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-text-muted block mb-1 uppercase text-[8px]">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-text-muted block mb-1 uppercase text-[8px]">Notes / WIRE REMITTANCE</label>
              <textarea
                placeholder="Payment terms instructions coordinates..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary p-2 focus:outline-none resize-none"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> {creating ? 'Generating...' : 'GENERATE STATEMENT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
