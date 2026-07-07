'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Download,
  Upload,
  Info
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
    id: string;
    name: string;
  };
}

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch('/api/studio/invoices')
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        if (data.length > 0) {
          setSelectedInvoice(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching invoices:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// FETCHING COMMERCIAL STATEMENTS...</span>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="font-mono text-[8px] uppercase tracking-wider px-2.5 py-0.5 border border-semantic-success/20 bg-semantic-success-bg/10 text-semantic-success rounded-full">
            PAID
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="font-mono text-[8px] uppercase tracking-wider px-2.5 py-0.5 border border-semantic-danger/20 bg-semantic-danger-bg/10 text-semantic-danger rounded-full">
            OVERDUE
          </span>
        );
      default:
        return (
          <span className="font-mono text-[8px] uppercase tracking-wider px-2.5 py-0.5 border border-semantic-warning/20 bg-semantic-warning-bg/10 text-semantic-warning rounded-full">
            UNPAID
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title section */}
      <div>
        <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
          COMMERCIAL RECONCILIATION
        </span>
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
          Invoices & Billings
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Historical invoice statements, active balances, and corporate wire details.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <Receipt className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            No Billing Logs
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            No active invoice records retrieved for this workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-6">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
                Billing Statement Matrix
              </h3>

              <div className="divide-y divide-border-subtle/40">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group transition-colors ${
                      selectedInvoice?.id === inv.id ? 'bg-brand-primary/5 px-2 rounded-xs border border-brand-primary/20' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                          {inv.invoiceNumber}
                        </span>
                        {getStatusBadge(inv.status)}
                      </div>
                      <p className="font-sans text-[11px] text-text-muted">
                        Linked Project: <span className="text-text-secondary">{inv.project.name}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-[10px] text-text-muted sm:text-right">
                      <div>
                        <span className="block text-[8px] text-text-muted/50">DUE DATE</span>
                        <span className="text-text-primary">{new Date(inv.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-text-muted/50">STATEMENT TOTAL</span>
                        <span className="text-text-primary font-bold">${inv.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Details & Wire Info */}
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Detailed billing parameters */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-6">
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
                    Invoice Details
                  </h3>
                  <div className="font-mono text-[10px] space-y-3 text-text-muted">
                    <div className="flex justify-between">
                      <span>Statement Number</span>
                      <span className="text-text-primary font-bold">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statement Value</span>
                      <span className="text-brand-primary font-bold">${selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maturity Date</span>
                      <span className="text-text-primary">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span>{selectedInvoice.status}</span>
                    </div>
                  </div>
                </div>

                {/* PDF generation mock download */}
                <div>
                  <a
                    href={`/api/studio/invoices/${selectedInvoice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 bg-brand-primary hover:bg-brand-hover text-white hover:text-white font-mono text-[9px] uppercase tracking-wider transition-colors rounded-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" /> DOWNLOAD STATEMENT PDF
                  </a>
                </div>
              </div>

              {/* Wire details */}
              <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
                  Payment SLA Coordinates
                </h3>

                <div className="p-4 bg-bg-base/30 border border-border-subtle/50 rounded-sm font-mono text-[9px] text-text-muted space-y-3">
                  <div className="flex items-start gap-2 text-brand-primary text-[8px] uppercase font-bold tracking-wide">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>CORPORATE BANK WIRE WIRE INSTRUCTIONS</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-text-muted/60">BENEFICIARY</span>
                    <span className="text-text-secondary">HAWKEDGE SYSTEMS INC.</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-text-muted/60">ROUTING NUMBER</span>
                    <span className="text-text-secondary">021000021 (ABA)</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-text-muted/60">IBAN DETAILS</span>
                    <span className="text-text-secondary">US89 HAWK 0120 4455 9988 22</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full py-2 bg-bg-surface border border-border-default hover:border-brand-primary text-text-secondary hover:text-text-primary font-mono text-[9px] uppercase tracking-wider hover:bg-bg-hover transition-all rounded-xs flex items-center justify-center gap-2">
                    <Upload className="w-3.5 h-3.5" /> UPLOAD REMITTANCE RECEIPT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
