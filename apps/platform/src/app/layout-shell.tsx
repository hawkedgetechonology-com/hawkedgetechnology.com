'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  LifeBuoy,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [clientProfile, setClientProfile] = useState<{
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Fetch profile and unread notification count
    fetch('/api/studio/profile')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then((data) => {
        setClientProfile({
          firstName: data.profile?.firstName || 'Client',
          lastName: data.profile?.lastName || 'Partner',
          companyName: data.profile?.companyName || 'HawkEdge Partner',
          email: data.email
        });
      })
      .catch(() => {
        // Fallback for offline/dev preview/simulated demo
        setClientProfile({
          firstName: 'Sarah',
          lastName: 'Jenkins',
          companyName: 'LogixFlow Global',
          email: 'client@logixflow.com'
        });
      });

    // Simulated/Real count updates
    fetch('/api/studio/notifications/unread-count')
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count ?? 3))
      .catch(() => setUnreadCount(2));
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
    { href: '/support', label: 'Support', icon: LifeBuoy },
    { href: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    // Clean session
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex font-body selection:bg-brand-primary/30 selection:text-white">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-bg-surface/90 border-b border-border-subtle flex items-center justify-between px-4 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-xs tracking-[0.2em] text-brand-primary uppercase">
            HAWKEDGE
          </span>
          <span className="font-mono text-[9px] text-text-muted border border-border-default px-1.5 py-0.5 rounded-xs uppercase">
            Studio
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-bg-surface border-r border-border-subtle flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:sticky lg:top-0`}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle mt-14 lg:mt-0 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm tracking-[0.2em] text-brand-primary uppercase">
              HAWKEDGE
            </span>
            <span className="font-mono text-[9px] text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-1.5 py-0.5 rounded-xs uppercase">
              Studio
            </span>
          </div>
        </div>

        {/* Client User Profile Summary */}
        {clientProfile && (
          <div className="p-4 mx-4 my-3 bg-bg-base/60 border border-border-subtle rounded-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center font-heading font-bold text-white text-xs select-none">
              {clientProfile.firstName[0]}
              {clientProfile.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-mono text-[10px] uppercase text-text-primary tracking-wide truncate">
                {clientProfile.firstName} {clientProfile.lastName}
              </h4>
              <p className="font-sans text-[11px] text-text-muted truncate">
                {clientProfile.companyName}
              </p>
            </div>
          </div>
        )}

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-sm font-mono text-[10px] tracking-wider uppercase transition-all duration-150 ${
                  active
                    ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-primary' : 'text-text-muted'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-border-subtle flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 text-[9px] font-mono text-semantic-success bg-semantic-success-bg/20 rounded-xs border border-semantic-success/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURE WORKSPACE v1.0</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-sm font-mono text-[10px] tracking-wider uppercase text-text-muted hover:text-red-400 hover:bg-red-950/10 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Row (Desktop only) */}
        <header className="hidden lg:flex h-16 bg-bg-surface/40 border-b border-border-subtle items-center justify-between px-8 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
              Active Environment // {pathname.split('/')[1]?.toUpperCase() || 'DASHBOARD'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick stats or notifications */}
            <Link
              href="/notifications"
              className="relative p-2 text-text-muted hover:text-text-primary transition-colors border border-border-subtle bg-bg-surface/60 rounded-xs"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-primary" />
              )}
            </Link>
            <div className="h-6 w-px bg-border-subtle" />
            <Link
              href="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center font-heading font-bold text-white text-[10px]">
                {clientProfile?.firstName[0] || 'C'}
              </div>
              <span className="font-mono text-[10px] text-text-secondary uppercase">
                {clientProfile?.companyName || 'Partner'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </Link>
          </div>
        </header>

        {/* Page children container */}
        <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
