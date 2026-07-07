'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  Save,
  CheckCircle
} from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  rank: string;
  status: string;
  mfaEnabled: boolean;
  profile: {
    firstName: string;
    lastName: string;
    phone: string | null;
    companyName: string | null;
    companyWebsite: string | null;
    companyGst: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
  };
}

export default function ProfileView() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyGst, setCompanyGst] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    fetch('/api/studio/profile')
      .then((res) => res.json())
      .then((profileData) => {
        setData(profileData);
        if (profileData?.profile) {
          const p = profileData.profile;
          setFirstName(p.firstName || '');
          setLastName(p.lastName || '');
          setPhone(p.phone || '');
          setCompanyName(p.companyName || '');
          setCompanyWebsite(p.companyWebsite || '');
          setCompanyGst(p.companyGst || '');
          setAddressLine1(p.addressLine1 || '');
          setAddressLine2(p.addressLine2 || '');
          setCity(p.city || '');
          setState(p.state || '');
          setZipCode(p.zipCode || '');
          setCountry(p.country || '');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/studio/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          companyName,
          companyWebsite,
          companyGst,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          country,
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
        <span>// FETCHING PROFILE METADATA LEDGER...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title section */}
      <div>
        <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
          STUDIO USER COORDINATES
        </span>
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
          Company Profile
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Manage contact person credentials, tax registrations, and primary billing coordinates.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Contact Person */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-primary" /> Contact details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Account Email</label>
                <div className="w-full bg-bg-base/50 border border-border-subtle/50 text-text-muted font-mono text-[10px] px-3 py-2 rounded-xs select-none">
                  {data?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Company Info */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-primary" /> Corporate Metadata
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Corporate GST / Tax Registration</label>
                <input
                  type="text"
                  placeholder="e.g. GSTIN998877A1"
                  value={companyGst}
                  onChange={(e) => setCompanyGst(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Corporate Website</label>
              <input
                type="text"
                placeholder="https://"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
              />
            </div>
          </div>

          {/* Section 3: Billing Address */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3">
              Corporate Address
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Zip / Postal Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Account details card & Save */}
        <div className="space-y-6">
          {/* System settings card */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-2">
              Corporate Account Info
            </h3>

            <div className="font-mono text-[10px] space-y-2 text-text-muted">
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Account Status</span>
                <span className="text-semantic-success font-bold">{data?.status}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/30 pb-2">
                <span>Clearance Rank</span>
                <span className="text-text-primary">{data?.rank}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>MFA Status</span>
                <span className={data?.mfaEnabled ? 'text-semantic-success' : 'text-text-muted'}>
                  {data?.mfaEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="border border-border-subtle bg-bg-surface/35 p-6 rounded-md space-y-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white font-mono text-[10px] uppercase tracking-wider transition-colors rounded-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>

            {saveSuccess && (
              <div className="p-3 bg-semantic-success-bg/25 border border-semantic-success/20 text-semantic-success text-[10px] font-mono text-center rounded-xs flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> PROFILE CHANGES COMMITTED
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
