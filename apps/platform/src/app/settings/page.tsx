'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldAlert,
  Smartphone,
  CheckCircle,
  AlertCircle,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface Session {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
}

interface SecurityOverview {
  mfaEnabled: boolean;
  accountCreated: string;
  lastLogin: string | null;
  lastLoginIp: string | null;
  activeSessions: number;
}

export default function SettingsView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [security, setSecurity] = useState<SecurityOverview | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states for password update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = () => {
    Promise.all([
      fetch('/api/studio/settings/sessions').then((res) => res.json()),
      fetch('/api/studio/settings/security').then((res) => res.json())
    ])
      .then(([sessionsData, securityData]) => {
        setSessions(sessionsData);
        setSecurity(securityData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
        setLoading(false);
      });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password key coordinates do not match confirmation.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch('/api/studio/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const resData = await res.json();
      if (res.ok) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(resData.message || 'Failed to update access password.');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Connection to key registers failed.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/studio/settings/sessions/${sessionId}/revoke`, {
        method: 'POST',
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        // Refresh security stats
        fetchSettingsData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// FETCHING ENVIRONMENT SECURITY COORDINATES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title section */}
      <div>
        <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
          STUDIO SYSTEM OVERRIDE
        </span>
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
          Security Settings
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Manage login credentials, active device tokens, and multi-factor session variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password Form */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-primary" /> Modify Security Key
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Current Password Key</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">New Password Key</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Confirm New Key</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                    required
                  />
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-semantic-danger-bg/25 border border-semantic-danger/20 text-semantic-danger text-[10px] font-mono rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-semantic-success-bg/25 border border-semantic-success/20 text-semantic-success text-[10px] font-mono rounded-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Password coordinates successfully committed to registers.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white font-mono text-[9px] uppercase tracking-wider transition-colors rounded-xs"
                >
                  {updatingPassword ? 'COMMITING...' : 'REWRITE PASSWORD KEY'}
                </button>
              </div>
            </form>
          </div>

          {/* Active Device Sessions List */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-brand-primary" /> Active Device Registers
              </span>
              <button
                onClick={fetchSettingsData}
                className="p-1 hover:bg-bg-hover text-text-muted hover:text-text-primary rounded transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </h3>

            {sessions.length === 0 ? (
              <p className="font-mono text-[9px] text-text-muted">// SYSTEM LOG: NO ACTIVE SESSIONS FOUND</p>
            ) : (
              <div className="space-y-3 divide-y divide-border-subtle/30">
                {sessions.map((s, idx) => (
                  <div key={s.id} className={`flex items-center justify-between gap-4 pt-3 ${idx === 0 ? 'pt-0' : ''}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs text-text-primary">
                          {s.deviceName || 'System Agent terminal'}
                        </span>
                        {idx === 0 && (
                          <span className="font-mono text-[7px] text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-1 rounded-xs uppercase">
                            Active Session
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[9px] text-text-muted">
                        IP: {s.ipAddress || '127.0.0.1'} &bull; Created: {new Date(s.createdAt).toLocaleString()}
                      </p>
                      <p className="font-mono text-[8px] text-text-muted/65 truncate max-w-sm sm:max-w-md md:max-w-lg">
                        UA: {s.userAgent || 'Mozilla Agent/5.0'}
                      </p>
                    </div>

                    {idx > 0 && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="p-1.5 border border-border-default text-text-muted hover:text-red-400 hover:border-red-900/35 transition-colors rounded-xs"
                        title="Revoke session key"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security Overview Card */}
        <div className="space-y-6">
          {/* Security details card */}
          {security && (
            <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-primary" /> Security overview
              </h3>

              <div className="font-mono text-[10px] space-y-3 text-text-muted">
                <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                  <span>MFA Status</span>
                  <span className={security.mfaEnabled ? 'text-semantic-success font-bold' : 'text-text-muted'}>
                    {security.mfaEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                  <span>Sessions Registers</span>
                  <span className="text-text-primary font-bold">{security.activeSessions} Active</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                  <span>Workspace Created</span>
                  <span className="text-text-primary">
                    {new Date(security.accountCreated).toLocaleDateString()}
                  </span>
                </div>
                {security.lastLogin && (
                  <div className="space-y-1">
                    <span className="block text-[8px] text-text-muted/60 uppercase">Last Registry Login</span>
                    <span className="text-text-secondary block">
                      {new Date(security.lastLogin).toLocaleString()}
                    </span>
                    <span className="text-[8px] text-text-muted/65 block">
                      IP: {security.lastLoginIp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
