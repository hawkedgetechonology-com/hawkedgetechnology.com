'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Building,
  Info,
  DollarSign
} from 'lucide-react';



export default function SettingsCockpit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [taxRatePercent, setTaxRatePercent] = useState(0);
  const [invoicePrefix, setInvoicePrefix] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [allowCustomQuotes, setAllowCustomQuotes] = useState(true);
  const [alertWebhookUrl, setAlertWebhookUrl] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setCompanyName(data.companyName || '');
        setWebsite(data.website || '');
        setBusinessHours(data.businessHours || '');
        setTaxRatePercent(data.taxRatePercent || 0);
        setInvoicePrefix(data.invoicePrefix || '');
        setCurrency(data.currency || 'USD');
        setAllowCustomQuotes(data.allowCustomQuotes ?? true);
        setAlertWebhookUrl(data.alertWebhookUrl || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
        setLoading(false);
      });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          website,
          businessHours,
          taxRatePercent: Number(taxRatePercent),
          invoicePrefix,
          currency,
          allowCustomQuotes,
          alertWebhookUrl,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
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
        <span>// HARNESSING HAWKEDGE MASTER SYSTEM CONFIGS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          HAWKEDGE OPERATING SYSTEM CONFIG
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Company Settings
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Adjust global tax percentages ratios, currency standards, invoice numbering schemas, and notification alert targets.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Corporate Profile */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" /> Company profile
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Legal Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Corporate Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Operational business hours</label>
              <input
                type="text"
                placeholder="e.g. 09:00 - 18:00 EST"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
              />
            </div>
          </div>

          {/* Section 2: Billings & Currencies */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" /> Commercial parameters
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Standard Billing Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-2 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                >
                  <option value="USD">USD (UNITED STATES DOLLARS)</option>
                  <option value="EUR">EUR (EUROS)</option>
                  <option value="GBP">GBP (GREAT BRITAIN POUNDS)</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Standard Tax percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Invoice numbering prefix</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Quotes policy validation</label>
                <select
                  value={allowCustomQuotes ? 'true' : 'false'}
                  onChange={(e) => setAllowCustomQuotes(e.target.value === 'true')}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-2 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
                >
                  <option value="true">ALLOW CUSTOM ESTIMATIONS SOW</option>
                  <option value="false">STRICT ENFORCED PROPOSAL TEMPLATES</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column save triggers */}
        <div className="space-y-6">
          {/* Webhook Configuration */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" /> System Alerts Webhooks
            </h3>

            <div>
              <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Alerting Webhook Endpoint</label>
              <input
                type="text"
                placeholder="https://"
                value={alertWebhookUrl}
                onChange={(e) => setAlertWebhookUrl(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-purple-400 rounded-xs"
              />
              <span className="block text-[8px] text-text-muted/65 font-mono mt-1 leading-relaxed">
                Slack or Discord channel webhooks for diagnostic warnings notifications.
              </span>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-mono text-[10px] uppercase tracking-wider transition-colors rounded-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'COMMITTING...' : 'SAVE SETTINGS'}
            </button>

            {saveSuccess && (
              <div className="p-3 bg-semantic-success-bg/25 border border-semantic-success/20 text-semantic-success text-[10px] font-mono text-center rounded-xs flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> SYSTEM SETTINGS COMMITTED
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
