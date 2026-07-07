import React from 'react';
import Link from 'next/link';
import { Printer, Cpu, Clock, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '@hawkedge/ui';
import { getRecommendations, calculateLeadMetrics } from './logic';

interface BriefViewerProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  answers: Record<string, any>;
  leadId?: string;
  onReset?: () => void;
}

export function BriefViewer({ answers, leadId, onReset }: BriefViewerProps) {
  const { leadScore, leadPriority } = calculateLeadMetrics(answers);
  const { techStack, architecture, estimatedDuration, advice } = getRecommendations(answers);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const metadataRows = [
    { label: 'Ingestion Client', value: answers.fullName || 'Anonymous' },
    { label: 'Enterprise/Org', value: answers.companyName || 'Indie/Private' },
    { label: 'Email Coordinates', value: answers.email || 'N/A' },
    { label: 'Deployment Channel', value: answers.buildType || 'N/A' },
    { label: 'Lead score', value: `${leadScore} / 100` },
    { label: 'Priority Clearance', value: leadPriority, highlight: true },
  ];

  return (
    <div className="w-full flex flex-col gap-8 print-container font-body">
      {/* Dynamic Print CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Reset backgrounds */
          body, html, main, div, section, h1, h2, h3, h4, span, p, li {
            background: #ffffff !important;
            color: #0b0f19 !important;
            box-shadow: none !important;
            border-color: #e2e8f0 !important;
          }
          /* Hide non-print coordinates */
          .no-print, header, footer, nav, button {
            display: none !important;
          }
          /* Full width print paper sizing */
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          .print-border {
            border: 1px solid #cbd5e1 !important;
          }
          .print-badge {
            border: 1px solid #000000 !important;
            padding: 2px 6px !important;
            background: transparent !important;
            color: #000000 !important;
          }
        }
      `}} />

      {/* Brief Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-default pb-6 gap-4">
        <div>
          <span className="font-mono text-[9px] text-brand-primary tracking-widest uppercase block mb-1">
            // COMPILED SPECIFICATION BRIEF
          </span>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight text-text-primary">
            Technical Architecture Brief
          </h2>
        </div>
        
        <div className="flex gap-3 no-print">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset} className="font-mono text-xs">
              Re-run Diagnostics
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="font-mono text-xs"
            rightIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Download PDF Brief
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Metadata & Details Ledger */}
        <div className="lg:col-span-1 border border-border-default bg-bg-surface/30 p-6 flex flex-col gap-6 print-border">
          <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase block pb-2 border-b border-border-subtle">
            // TELEMETRY METRIC LEDGER
          </span>
          
          <div className="flex flex-col gap-4 font-mono text-[11px]">
            {metadataRows.map((row) => (
              <div key={row.label} className="flex justify-between items-baseline gap-2 py-1.5 border-b border-border-subtle/50">
                <span className="text-text-muted">{row.label.toUpperCase()}:</span>
                <span className={`text-right font-bold truncate max-w-[180px] ${
                  row.highlight 
                    ? row.value === 'HIGH' 
                      ? 'text-semantic-danger print-badge' 
                      : 'text-brand-primary print-badge' 
                    : 'text-text-primary'
                }`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[10px] text-text-muted leading-relaxed border-t border-border-subtle pt-4">
            <span className="font-bold text-text-secondary block mb-1">AUDIT DIRECTIVE:</span>
            {leadPriority === 'HIGH' 
              ? 'Lead Score exceeds clearance parameters. System architectures must be reviewed by a Lead Architect within 12 hours.'
              : 'Standard operational queue parameters active. Follow standard scheduling workflows.'
            }
          </div>

          {leadId && (
            <div className="mt-4 pt-4 border-t border-border-subtle no-print">
              <Link href={`/booking?leadId=${leadId}&name=${encodeURIComponent(answers.fullName || '')}&company=${encodeURIComponent(answers.companyName || '')}&email=${encodeURIComponent(answers.email || '')}`}>
                <Button
                  variant="primary"
                  className="w-full font-mono text-xs uppercase"
                >
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Recommendations Panel */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Architecture Summary */}
          <div className="border border-border-default bg-bg-surface/10 p-6 print-border">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-brand-primary">
              <Layers className="w-4 h-4" />
              <span>// SUGGESTED APPLICATION ARCHITECTURE</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed font-body">
              {architecture}
            </p>
          </div>

          {/* Key Recommendations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Tech Stack List */}
            <div className="border border-border-default p-5 print-border">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-brand-primary">
                <Cpu className="w-4 h-4" />
                <span>// RECOMMENDATION STACK</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-bg-elevated border border-border-subtle text-text-primary font-mono text-[10px] print-badge"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="border border-border-default p-5 print-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 font-mono text-xs text-brand-primary">
                  <Clock className="w-4 h-4" />
                  <span>// BUILD TIMELINE INDEX</span>
                </div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-text-primary block mb-1">
                  {estimatedDuration}
                </span>
                <span className="text-[10px] text-text-muted font-mono">// INITIAL DEVELOPMENT ESTIMATE CYCLE</span>
              </div>
            </div>

          </div>

          {/* Operational Checklist / Directives */}
          <div className="border border-border-default p-6 print-border">
            <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase block mb-4">
              // ARCHITECTURAL DESIGN DIRECTIVES
            </span>
            <ul className="space-y-3 font-body">
              {advice.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-text-secondary leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
