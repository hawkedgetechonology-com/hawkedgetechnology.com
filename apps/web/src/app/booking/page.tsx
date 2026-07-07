'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle2, ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@hawkedge/ui';

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters pre-population
  const queryLeadId = searchParams.get('leadId') || '';
  const queryName = searchParams.get('name') || '';
  const queryCompany = searchParams.get('company') || '';
  const queryEmail = searchParams.get('email') || '';

  // Form state parameters
  const [leadId, setLeadId] = useState(queryLeadId);
  const [fullName, setFullName] = useState(queryName);
  const [companyName, setCompanyName] = useState(queryCompany);
  const [email, setEmail] = useState(queryEmail);
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  });

  // Calendar parameters (next 10 days)
  const [dates, setDates] = useState<{ label: string; value: string; isWeekend: boolean }[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Status flags
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meetingDetails, setMeetingDetails] = useState<any>(null);

  // Generate 10 consecutive weekdays for calendar
  useEffect(() => {
    const list: { label: string; value: string; isWeekend: boolean }[] = [];
    const current = new Date();
    // Start from tomorrow
    current.setDate(current.getDate() + 1);

    while (list.length < 10) {
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6;
      
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const dateVal = String(current.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dateVal}`;

      const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const label = current.toLocaleDateString('en-US', options);

      if (!isWeekend) {
        list.push({
          label,
          value: dateString,
          isWeekend,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    setDates(list);
    if (list.length > 0 && list[0]) {
      setSelectedDate(list[0].value);
    }
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError(null);
      setSelectedSlot(null);
      try {
        const res = await fetch(`/api/meetings/slots?date=${selectedDate}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve slots');
        }
        const data = await res.json();
        setSlots(data.slots || []);
      } catch (err) {
        setError('Could not connect to slots validation directory.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  // Sync inputs with query params changes
  useEffect(() => {
    if (queryLeadId) setLeadId(queryLeadId);
    if (queryName) setFullName(queryName);
    if (queryCompany) setCompanyName(queryCompany);
    if (queryEmail) setEmail(queryEmail);
  }, [queryLeadId, queryName, queryCompany, queryEmail]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select an available consultation time slot.');
      return;
    }
    if (!leadId) {
      setError('A valid Discovery lead reference code ID is required to schedule.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      leadId,
      title: `Consultation: ${companyName || 'Enterprise Tech'}`,
      purpose: purpose || 'Discovery Blueprint Review',
      notes,
      scheduledAt: selectedSlot,
      durationMinutes: 30,
    };

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to complete booking transaction.');
      }

      const data = await res.json();
      setMeetingDetails(data.meeting);
      setBookingComplete(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Booking transaction failed.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSlotTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });
  };

  if (bookingComplete) {
    return (
      <div className="bg-bg-base text-text-primary min-h-screen py-20 px-4 font-body flex items-center justify-center">
        <div className="max-w-md w-full border border-border-default bg-bg-surface p-8 space-y-6">
          <div className="flex items-center space-x-3 border-b border-border-subtle pb-4">
            <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0" />
            <div>
              <span className="font-mono text-[9px] text-brand-primary block uppercase">// CONFIRMED RECORD</span>
              <h2 className="text-lg font-heading font-extrabold">Meeting Successfully Scheduled</h2>
            </div>
          </div>

          <div className="space-y-3 font-mono text-[11px] bg-bg-base p-4 border border-border-subtle">
            <div className="flex justify-between py-1 border-b border-border-subtle/50">
              <span className="text-text-muted">CLIENT:</span>
              <span className="font-bold text-text-primary">{fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle/50">
              <span className="text-text-muted">ENTERPRISE:</span>
              <span className="font-bold text-text-primary">{companyName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle/50">
              <span className="text-text-muted">DATE / TIME:</span>
              <span className="font-bold text-brand-primary">
                {new Date(meetingDetails?.scheduledAt).toLocaleDateString()} @ {formatSlotTime(meetingDetails?.scheduledAt)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle/50">
              <span className="text-text-muted">TIMEZONE:</span>
              <span className="font-bold text-text-secondary truncate max-w-[150px]" title={timezone}>
                {timezone}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">REFERENCE ID:</span>
              <span className="font-bold text-text-muted truncate max-w-[150px]">{meetingDetails?.id}</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-body">
            A confirmation schedule link and agenda calendar event coordinates have been sent to <span className="font-semibold text-text-primary">{email}</span>.
          </p>

          <Button
            variant="primary"
            className="w-full font-mono text-xs uppercase"
            onClick={() => router.push('/')}
          >
            Return to Core Ledger
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-border-default pb-8 mb-12 flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-3">
              // 09 / CONSULTATION_SCHEDULER
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
              Book Technical Consultation.
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="no-print flex items-center gap-1.5 px-3 py-1.5 border border-border-subtle text-text-muted hover:text-text-primary font-mono text-[10px] transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary bg-bg-surface/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> REVERT_BACK
          </button>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="mb-8 px-4 py-3 bg-semantic-danger-bg border border-semantic-danger/30 text-semantic-danger font-mono text-[10px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>ERROR: {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Coordinates confirmation & notes (5/12 cols) */}
          <div className="lg:col-span-5 border border-border-default bg-bg-surface/30 p-6 space-y-6">
            <div className="border-b border-border-subtle pb-4">
              <span className="font-mono text-[9px] text-brand-primary block uppercase">// CONFIRM COORDINATES</span>
              <h3 className="text-base font-heading font-bold mt-1">Lead Client Ledger</h3>
            </div>

            {!leadId ? (
              <div className="bg-[#1a0f12] border border-semantic-danger/20 p-4 text-xs space-y-3 font-body text-text-secondary">
                <p>
                  No client Discovery Engine identifier key was parsed. Please complete the project specification engine to qualify for direct consultation bookings.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full font-mono text-[10px] uppercase"
                  onClick={() => router.push('/')}
                >
                  Initiate Discovery Engine
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-bg-base/50 p-3 border border-border-subtle">
                    <span className="text-[9px] text-text-muted block">REPRESENTATIVE:</span>
                    <span className="font-bold text-text-primary block mt-1 truncate">{fullName || 'Anonymous'}</span>
                  </div>
                  <div className="bg-bg-base/50 p-3 border border-border-subtle">
                    <span className="text-[9px] text-text-muted block">ENTERPRISE:</span>
                    <span className="font-bold text-text-primary block mt-1 truncate">{companyName || 'Indie'}</span>
                  </div>
                </div>

                <div className="bg-bg-base/50 p-3 border border-border-subtle text-xs font-mono">
                  <span className="text-[9px] text-text-muted block">EMAIL COORDINATES:</span>
                  <span className="font-bold text-text-secondary block mt-1 truncate">{email}</span>
                </div>

                {/* Additional Inputs */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-mono text-text-secondary">
                    TIMEZONE SELECTOR
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-[#0c1220] border border-border-default text-text-primary rounded-sm p-2 text-xs focus:outline-none focus:border-brand-primary cursor-pointer font-mono"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  </select>

                  <label className="block text-xs font-mono text-text-secondary pt-2">
                    MEETING PURPOSE DIRECTIVE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Discussing Frontend Architecture or CRM..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-bg-base border border-border-default text-text-primary rounded-sm p-2.5 text-xs focus:outline-none focus:border-brand-primary placeholder-text-placeholder"
                  />

                  <label className="block text-xs font-mono text-text-secondary pt-2">
                    ADDITIONAL LOG NOTES
                  </label>
                  <textarea
                    placeholder="Specific architectural constraints, legacy stacks, budget indices..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-bg-base border border-border-default text-text-primary rounded-sm p-2.5 text-xs focus:outline-none focus:border-brand-primary placeholder-text-placeholder resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Date and slot grid picker (7/12 cols) */}
          <div className="lg:col-span-7 border border-border-default bg-bg-surface/30 p-6 space-y-6">
            <div className="border-b border-border-subtle pb-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] text-brand-primary block uppercase">// AVAILABILITY LEDGER</span>
                <h3 className="text-base font-heading font-bold mt-1">Calendar & Time Slots</h3>
              </div>
              <Calendar className="h-5 w-5 text-brand-primary" />
            </div>

            {/* Date Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-text-muted block uppercase">SELECT WORKING DAY</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-2.5 border text-center transition-all ${
                      selectedDate === d.value
                        ? 'border-brand-primary bg-bg-elevated/20 text-brand-primary font-bold'
                        : 'border-border-subtle hover:border-border-default text-text-secondary hover:text-text-primary bg-bg-base/30'
                    }`}
                  >
                    <span className="block text-[10px] font-mono tracking-tight uppercase">
                      {d.label.split(',')[0]}
                    </span>
                    <span className="block text-xs font-heading mt-1 font-bold">
                      {d.label.split(',')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted block uppercase">AVAILABLE HALF-HOUR SLOTS</span>
                <span className="text-[9px] font-mono text-text-placeholder uppercase">Preventing Double-Booking</span>
              </div>

              {loadingSlots ? (
                <div className="p-8 border border-border-subtle bg-bg-base/30 flex items-center justify-center space-x-2 text-text-muted font-mono text-xs">
                  <Clock className="h-4 w-4 animate-spin text-brand-primary" />
                  <span>Accessing ledger schedules...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="p-8 border border-border-subtle bg-bg-base/30 text-center text-text-muted text-xs font-body">
                  No slots currently available on this day or business coordinates are blocked.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const isSelected = selectedSlot === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className={`p-3 border text-center font-mono text-xs transition-all ${
                          isSelected
                            ? 'border-brand-primary bg-bg-elevated/20 text-brand-primary font-bold'
                            : 'border-border-subtle hover:border-border-default text-text-secondary hover:text-text-primary bg-bg-base/30'
                        }`}
                      >
                        {formatSlotTime(s)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit Block */}
            <div className="border-t border-border-subtle pt-6 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleBookingSubmit}
                isLoading={submitting}
                disabled={!selectedSlot || !leadId}
                className="w-full sm:w-auto font-mono text-xs uppercase"
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Confirm Consultation Booking
              </Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="bg-bg-base text-text-muted min-h-screen flex items-center justify-center font-mono text-xs">
        Loading scheduler coordinates...
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
