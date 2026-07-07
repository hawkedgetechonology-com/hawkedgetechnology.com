'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, Plus, Trash2, Send, Search, ChevronDown,
  FileText, Calculator, ArrowRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
}

interface Proposal {
  id: string;
  title: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  currency: string;
  taxRate: number;
  discount: number;
  totalAmount: number;
  validUntil: string;
  paymentTerms: string;
  createdAt: string;
  leadId: string;
  lead: Lead;
  proposalId?: string;
  proposal?: Proposal;
  items: QuotationItem[];
}

// ─── Line Item Row ─────────────────────────────────────────────────────────

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

function LineItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: LineItem;
  onChange: (updated: LineItem) => void;
  onRemove: () => void;
}) {
  const amount = item.quantity * item.rate;
  return (
    <div className="grid grid-cols-[2fr_80px_100px_100px_36px] gap-2 items-center">
      <input
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        placeholder="Description"
        className="bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
      />
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => onChange({ ...item, quantity: Math.max(1, Number(e.target.value)) })}
        className="bg-bg-base border border-border-default text-text-primary text-xs font-mono px-2 py-2 focus:outline-none focus:border-brand-primary text-right"
        min="1"
      />
      <input
        type="number"
        value={item.rate}
        onChange={(e) => onChange({ ...item, rate: Math.max(0, Number(e.target.value)) })}
        className="bg-bg-base border border-border-default text-text-primary text-xs font-mono px-2 py-2 focus:outline-none focus:border-brand-primary text-right"
        min="0"
      />
      <span className="text-right text-xs font-mono text-text-secondary pr-1">
        {amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
      <button
        onClick={onRemove}
        className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Create Quotation Modal ────────────────────────────────────────────────────

function CreateQuotationModal({
  leads,
  proposals,
  onSave,
  onClose,
}: {
  leads: Lead[];
  proposals: Proposal[];
  onSave: (data: {
    leadId: string;
    proposalId?: string;
    currency: string;
    taxRate: number;
    discount: number;
    validUntil: string;
    paymentTerms: string;
    items: LineItem[];
  }) => Promise<void>;
  onClose: () => void;
}) {
  const [leadId, setLeadId] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [validUntil, setValidUntil] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, rate: 0 }]);
  const [saving, setSaving] = useState(false);

  const subtotal = items.reduce((acc, i) => acc + i.quantity * i.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax - discount;

  const addItem = () => setItems((prev) => [...prev, { description: '', quantity: 1, rate: 0 }]);
  const updateItem = (index: number, updated: LineItem) =>
    setItems((prev) => prev.map((it, i) => (i === index ? updated : it)));
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!leadId || items.some((i) => !i.description.trim())) return;
    setSaving(true);
    try {
      await onSave({
        leadId,
        proposalId: proposalId || undefined,
        currency,
        taxRate: taxRate / 100,
        discount,
        validUntil,
        paymentTerms,
        items,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/90 backdrop-blur-sm p-4">
      <div className="bg-bg-surface border border-border-default w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-primary" />
            <span className="font-mono text-xs text-brand-primary uppercase tracking-widest">New Quotation</span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            ✕ CLOSE
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Linked Lead *</label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              >
                <option value="">— Select Lead —</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>{l.companyName} · {l.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Linked Proposal</label>
              <select
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              >
                <option value="">— Standalone Quotation —</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              >
                {['USD', 'EUR', 'GBP', 'NGN', 'KES', 'ZAR', 'GHS'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Payment Terms</label>
              <input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Net 30"
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
                min="0"
                max="100"
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="font-mono text-[9px] text-text-muted uppercase block mb-1">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-bg-base border border-border-default text-text-primary text-xs font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] text-text-muted uppercase">Line Items</span>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-[10px] font-mono text-brand-primary hover:underline"
              >
                <Plus className="w-3 h-3" /> ADD ROW
              </button>
            </div>
            {/* Header */}
            <div className="grid grid-cols-[2fr_80px_100px_100px_36px] gap-2 mb-1">
              {['Description', 'Qty', 'Rate', 'Amount', ''].map((h) => (
                <span key={h} className="text-[9px] font-mono text-text-muted uppercase">{h}</span>
              ))}
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <LineItemRow
                  key={i}
                  item={item}
                  onChange={(updated) => updateItem(i, updated)}
                  onRemove={() => removeItem(i)}
                />
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-border-default pt-4 space-y-2">
            <div className="flex justify-end gap-8">
              <div className="space-y-1 text-right">
                <div className="flex items-center justify-between gap-12 text-[10px] font-mono text-text-muted">
                  <span>SUBTOTAL</span>
                  <span>{currency} {subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between gap-12 text-[10px] font-mono text-text-muted">
                  <span>TAX ({taxRate}%)</span>
                  <span>{currency} {tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <label className="font-mono text-[9px] text-text-muted">DISCOUNT</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-bg-base border border-border-default text-text-primary text-[10px] font-mono px-2 py-1 text-right focus:outline-none focus:border-brand-primary"
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-between gap-12 text-sm font-heading font-bold text-text-primary border-t border-border-default pt-2">
                  <span>TOTAL</span>
                  <span>{currency} {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border-default pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-mono border border-border-default text-text-muted hover:text-text-primary transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={!leadId || saving || items.some((i) => !i.description.trim())}
              className="px-6 py-2 text-xs font-mono font-bold bg-brand-primary text-white hover:bg-brand-primary/80 disabled:opacity-50 transition-colors"
            >
              {saving ? '...' : 'CREATE QUOTATION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  SENT: 'bg-indigo-900/40 text-indigo-300 border-indigo-700',
  ACCEPTED: 'bg-green-900/40 text-green-300 border-green-700',
  REJECTED: 'bg-red-900/40 text-red-300 border-red-700',
  EXPIRED: 'bg-orange-900/40 text-orange-300 border-orange-700',
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, lRes, pRes] = await Promise.all([
        fetch('/api/quotations'),
        fetch('/api/leads?limit=200'),
        fetch('/api/proposals'),
      ]);
      setQuotations(await qRes.json());
      const lData = await lRes.json();
      setLeads(lData.leads || []);
      const pData = await pRes.json();
      setProposals(Array.isArray(pData) ? pData : pData.proposals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createQuotation = async (data: {
    leadId: string;
    proposalId?: string;
    currency: string;
    taxRate: number;
    discount: number;
    validUntil: string;
    paymentTerms: string;
    items: LineItem[];
  }) => {
    await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setModalOpen(false);
    fetchData();
  };

  const updateStatus = async (quotationId: string, status: string) => {
    setActionLoading(quotationId + status);
    try {
      await fetch(`/api/quotations/${quotationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = quotations.filter((q) => {
    const matchSearch = !search ||
      q.quotationNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.lead?.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="bg-bg-base text-text-primary min-h-screen font-body">
      {modalOpen && (
        <CreateQuotationModal
          leads={leads}
          proposals={proposals}
          onSave={createQuotation}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="border-b border-border-default bg-bg-surface/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-brand-primary" />
          <span className="font-heading font-bold text-sm tracking-tight text-text-primary">HAWKEDGE ADMIN</span>
          <span className="font-mono text-xs text-text-muted">// QUOTATION ENGINE</span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-mono font-bold hover:bg-brand-primary/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          NEW QUOTATION
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by number or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-surface border border-border-default text-text-primary text-xs font-mono pl-8 pr-4 py-2 focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg-surface border border-border-default text-text-primary text-xs font-mono px-4 py-2 focus:outline-none focus:border-brand-primary"
          >
            <option value="">All Statuses</option>
            {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].map((s) => (
            <div
              key={s}
              onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
              className={`border p-3 cursor-pointer transition-all ${
                statusFilter === s ? 'border-brand-primary bg-brand-primary/5' : 'border-border-default bg-bg-surface/20 hover:border-brand-primary/50'
              }`}
            >
              <div className="font-mono text-xl font-bold text-text-primary">
                {quotations.filter((q) => q.status === s).length}
              </div>
              <div className="font-mono text-[9px] text-text-muted uppercase">{s}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-text-muted">// LOADING QUOTATIONS...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 font-mono text-xs text-text-muted">// NO QUOTATIONS FOUND</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="border border-border-default bg-bg-surface/20 overflow-hidden"
              >
                {/* Row Header */}
                <div
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-bg-surface/40 transition-colors"
                  onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                >
                  <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                    <div>
                      <span className="font-mono text-xs font-bold text-text-primary">{q.quotationNumber}</span>
                    </div>
                    <div>
                      <p className="font-body text-xs text-text-secondary truncate">{q.lead?.companyName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-text-primary">
                        {q.currency} {q.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${STATUS_STYLES[q.status]}`}>
                        {q.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {q.status === 'DRAFT' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(q.id, 'SENT'); }}
                        disabled={actionLoading === q.id + 'SENT'}
                        className="p-1.5 border border-border-default text-text-muted hover:text-indigo-400 hover:border-indigo-700 transition-colors"
                        title="Send"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                    <a
                      href={`/api/quotations/${q.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 border border-border-default text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                      title="Download PDF"
                    >
                      <FileText className="w-3 h-3" />
                    </a>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-text-muted transition-transform ${expanded === q.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* Expanded Items */}
                {expanded === q.id && (
                  <div className="border-t border-border-default px-4 py-4 bg-bg-base/40">
                    {/* Items table */}
                    <div className="mb-4">
                      <div className="grid grid-cols-[2fr_80px_100px_100px] gap-2 mb-2">
                        {['Description', 'Qty', 'Rate', 'Amount'].map((h) => (
                          <span key={h} className="text-[9px] font-mono text-text-muted uppercase">{h}</span>
                        ))}
                      </div>
                      {q.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-[2fr_80px_100px_100px] gap-2 py-1 border-b border-border-default/40">
                          <span className="text-xs font-body text-text-secondary">{item.description}</span>
                          <span className="text-xs font-mono text-text-secondary text-right">{item.quantity}</span>
                          <span className="text-xs font-mono text-text-secondary text-right">{q.currency} {item.rate.toLocaleString()}</span>
                          <span className="text-xs font-mono text-text-primary text-right font-bold">{q.currency} {item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-4 text-xs font-mono text-text-muted">
                      <span>Tax ({(q.taxRate * 100).toFixed(0)}%)</span>
                      <span>Discount: {q.currency} {q.discount.toLocaleString()}</span>
                      <span className="text-text-primary font-bold">
                        TOTAL: {q.currency} {q.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="font-mono text-[10px] text-text-muted">
                        Valid until: {new Date(q.validUntil).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })} · {q.paymentTerms}
                      </div>
                      {q.proposal && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                          <ArrowRight className="w-3 h-3 text-brand-primary" />
                          <span>Linked to: <span className="text-brand-primary">{q.proposal.title}</span></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
