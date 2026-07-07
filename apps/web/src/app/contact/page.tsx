'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield } from 'lucide-react';
import { DiscoveryEngine } from '../../components/discovery/DiscoveryEngine';
import { AdminConsole } from '../../components/discovery/AdminConsole';

function ContactPageContent() {
  const searchParams = useSearchParams();
  const adminParam = searchParams.get('admin');
  
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    if (adminParam === 'true') {
      setIsAdminMode(true);
    }
  }, [adminParam]);

  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-12 sm:py-16 md:py-20 font-body flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8">
        
        {/* Page Title & Navigation Tabs */}
        <div className="max-w-3xl border-b border-border-default pb-8">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
            // DISCOVER PROTOCOLS
          </span>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
            {isAdminMode ? 'Systems Ingestion Console' : 'Guided Consultation Request'}
          </h1>
          <p className="text-xs text-text-secondary mt-2">
            {isAdminMode 
              ? 'Telemetry dashboard auditing incoming client coordinates, metrics validation, and CRM integration parameters.' 
              : 'Our intelligent engineering assistant will guide you through system specifications. No marketing pitches. Just specifications.'
            }
          </p>

          {/* Dev/Admin Toggles */}
          <div className="flex gap-4 mt-6 font-mono text-[9px]">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`px-3 py-1 border transition-colors focus:outline-none ${
                !isAdminMode 
                  ? 'border-brand-primary text-brand-primary bg-bg-surface' 
                  : 'border-border-default text-text-muted hover:text-text-primary'
              }`}
            >
              CLIENT_DISCOVERY_ENGINE
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`px-3 py-1 border transition-colors focus:outline-none flex items-center gap-1 ${
                isAdminMode 
                  ? 'border-brand-primary text-brand-primary bg-bg-surface' 
                  : 'border-border-default text-text-muted hover:text-text-primary'
              }`}
            >
              <Shield className="w-3 h-3" /> ADMIN_TELEMETRY_DASHBOARD
            </button>
          </div>
        </div>

        {/* Content Render Pane */}
        <div className="flex-grow flex items-stretch">
          {isAdminMode ? <AdminConsole /> : <DiscoveryEngine />}
        </div>

      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="bg-bg-base text-text-primary min-h-screen flex items-center justify-center font-mono text-xs text-text-muted">
        <span>// INITIALIZING SYSTEM MODULES...</span>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}
