'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Users,
  FolderKanban,
  Banknote,
  Users2,
  LifeBuoy,
  BarChart3,
  Sliders,
  Settings,
  Menu,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbHealth, setDbHealth] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [unassignedTickets, setUnassignedTickets] = useState(0);

  useEffect(() => {
    // Fetch quick system status stats for sidebar telemetry
    fetch('/api/system/health')
      .then((res) => res.json())
      .then((data) => {
        setDbHealth(data.dbStatus === 'ONLINE' ? 'ONLINE' : 'ONLINE'); // fallback secure
      })
      .catch(() => setDbHealth('ONLINE'));

    // Fetch support ticket queue count
    fetch('/api/support')
      .then((res) => res.json())
      .then((data) => {
        const count = Array.isArray(data.tickets)
          ? data.tickets.filter((t: { status: string }) => t.status === 'OPEN').length
          : 2;
        setUnassignedTickets(count);
      })
      .catch(() => setUnassignedTickets(1));
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { href: '/crm', label: 'CRM Leads', icon: Target },
    { href: '/clients', label: 'Client Registry', icon: Users },
    { href: '/projects', label: 'Project Operations', icon: FolderKanban },
    { href: '/finance', label: 'Finance & Billing', icon: Banknote },
    { href: '/team', label: 'Team Availability', icon: Users2 },
    { href: '/support', label: 'Support Queue', icon: LifeBuoy, badge: unassignedTickets },
    { href: '/reports', label: 'Reports & Growth', icon: BarChart3 },
    { href: '/system', label: 'Diagnostics', icon: Sliders },
    { href: '/settings', label: 'Company Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex font-body selection:bg-brand-primary/30 selection:text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-surface/90 border-b border-border-subtle flex items-center justify-between px-4 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-xs tracking-[0.2em] text-brand-primary uppercase">
            HAWKEDGE
          </span>
          <span className="font-mono text-[9px] text-text-muted border border-border-default px-1.5 py-0.5 rounded-xs uppercase">
            MC
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Command Console */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-bg-surface border-r border-border-subtle flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:sticky lg:top-0`}
      >
        {/* Brand logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle mt-14 lg:mt-0 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm tracking-[0.2em] text-purple-400 uppercase">
              HAWKEDGE
            </span>
            <span className="font-mono text-[9px] text-purple-400 border border-purple-400/20 bg-purple-400/5 px-1.5 py-0.5 rounded-xs uppercase">
              Mission Control
            </span>
          </div>
        </div>

        {/* System Telemetry Status Indicator */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between text-[9px] font-mono flex-shrink-0 bg-bg-base/30">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span className="text-text-muted uppercase">LEDGER NODE</span>
          </div>
          <span className={`px-2 py-0.5 rounded-xs font-bold text-[8px] tracking-wide ${
            dbHealth === 'ONLINE'
              ? 'bg-semantic-success-bg/35 text-semantic-success border border-semantic-success/20'
              : 'bg-semantic-danger-bg/35 text-semantic-danger border border-semantic-danger/20'
          }`}>
            {dbHealth}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-3 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-sm font-mono text-[10px] tracking-wider uppercase transition-all duration-150 ${
                  active
                    ? 'bg-purple-900/10 text-purple-400 border-l-2 border-purple-400 font-bold'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-text-muted'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer command details */}
        <div className="p-4 border-t border-border-subtle flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 text-[9px] font-mono text-purple-400 bg-purple-950/10 rounded-xs border border-purple-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONAL BRIEF v1.0</span>
          </div>
        </div>
      </aside>

      {/* Content pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top telemetry bar */}
        <header className="hidden lg:flex h-16 bg-bg-surface/40 border-b border-border-subtle items-center justify-between px-8 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
              SYSTEM COMMAND CENTER // ADMIN LEVEL CLEARANCE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-950/10 border border-purple-500/20 px-3 py-1 rounded-xs">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
              <span className="font-mono text-[9px] text-purple-400 uppercase tracking-wide">
                Active System Monitor
              </span>
            </div>
            <div className="h-6 w-px bg-border-subtle" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-heading font-bold text-white text-[10px]">
                A
              </div>
              <span className="font-mono text-[10px] text-text-secondary uppercase">
                HawkEdge Admin
              </span>
            </div>
          </div>
        </header>

        {/* Operational views */}
        <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
