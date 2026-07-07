'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Send,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  category: string;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SupportDesk() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);

  // Form states for new ticket
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [category, setCategory] = useState('GENERAL');
  const [submitting, setSubmitting] = useState(false);

  // Form states for reply
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    fetch('/api/studio/support')
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        if (data.length > 0) {
          // Keep active ticket selected if it was before, otherwise first
          setSelectedTicket((prev) => {
            const found = data.find((t: Ticket) => t.id === prev?.id);
            return found || data[0];
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tickets:', err);
        setLoading(false);
      });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/studio/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, priority, category }),
      });
      if (res.ok) {
        setSubject('');
        setMessage('');
        setPriority('NORMAL');
        setCategory('GENERAL');
        setNewTicketModalOpen(false);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);

    try {
      const res = await fetch(`/api/studio/support/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        setReplyText('');
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(false);
    }
  };

  const parseReplies = (responseField: string | null): Array<{ timestamp: string; author: string; text: string }> => {
    if (!responseField) return [];
    return responseField.split('\n---\n').map((block) => {
      // Format matches: [timestamp] Author: text
      const regex = /^\[([^\]]+)\]\s+([^:]+):\s+([\s\S]+)$/;
      const match = block.trim().match(regex);
      if (match && match[1] && match[2] && match[3]) {
        return {
          timestamp: match[1],
          author: match[2],
          text: match[3],
        };
      }
      return {
        timestamp: new Date().toISOString(),
        author: 'Support Analyst',
        text: block,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// SECURING COM CHANNEL WITH SUPPORT DESK...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex items-end justify-between border-b border-border-subtle pb-6 gap-4">
        <div>
          <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
            CLIENT OPERATIONS DESK
          </span>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
            Support center
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Open secure bug reports, billing enquiries, or technical configuration support channels.
          </p>
        </div>
        <button
          onClick={() => setNewTicketModalOpen(true)}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-mono text-[9px] uppercase tracking-wider transition-colors rounded-xs flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> NEW TICKET
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <LifeBuoy className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            No Support Logs
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            Open a secure channel to contact our systems developers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="border border-border-subtle bg-bg-surface/35 rounded-md p-5 h-[calc(100vh-240px)] overflow-y-auto">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary border-b border-border-subtle pb-3 mb-4">
                Active Tickets
              </h3>

              <div className="space-y-2">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 border rounded-sm cursor-pointer hover:border-brand-primary/50 transition-all ${
                      selectedTicket?.id === t.id
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-border-subtle/50 bg-bg-base/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-mono text-[7px] border px-1.5 py-0.5 rounded-full ${
                        t.priority === 'URGENT' || t.priority === 'HIGH'
                          ? 'border-semantic-danger/35 text-semantic-danger bg-semantic-danger-bg/10'
                          : 'border-border-default text-text-muted bg-bg-base'
                      }`}>
                        {t.priority}
                      </span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-xs ${
                        t.status === 'OPEN'
                          ? 'text-blue-400 bg-blue-950/20 border border-blue-500/20'
                          : t.status === 'IN_PROGRESS'
                          ? 'text-yellow-400 bg-yellow-950/20 border border-yellow-500/20'
                          : 'text-green-400 bg-green-950/20 border border-green-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-heading font-semibold text-xs text-text-primary truncate">
                      {t.subject}
                    </h4>
                    <p className="font-mono text-[8px] text-text-muted mt-1.5">
                      {t.category} &bull; {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Messages Column */}
          <div className="lg:col-span-2">
            {selectedTicket && (
              <div className="border border-border-subtle bg-bg-surface/35 rounded-md flex flex-col h-[calc(100vh-240px)]">
                {/* Message Header */}
                <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
                  <div>
                    <h3 className="font-heading font-bold text-xs text-text-primary">
                      {selectedTicket.subject}
                    </h3>
                    <p className="font-mono text-[8px] text-text-muted mt-1">
                      TICKET ID: {selectedTicket.id.toUpperCase()} &bull; Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right font-mono text-[9px] text-text-muted">
                    <span>Priority: <span className="text-text-primary">{selectedTicket.priority}</span></span>
                    <span className="block mt-0.5">Category: <span className="text-text-primary">{selectedTicket.category}</span></span>
                  </div>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {/* Original client request */}
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-mono font-bold text-white text-[10px] flex-shrink-0">
                      C
                    </div>
                    <div className="flex-1 bg-bg-base/50 border border-border-subtle/50 p-4 rounded-sm">
                      <div className="flex items-center justify-between text-[8px] font-mono text-text-muted mb-2">
                        <span>CLIENT (ORIGINAL REQUEST)</span>
                        <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-text-secondary whitespace-pre-wrap">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>

                  {/* Reply list thread */}
                  {parseReplies(selectedTicket.response).map((reply, idx) => {
                    const isClient = reply.author.toLowerCase().includes('client');
                    return (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-white text-[10px] flex-shrink-0 ${
                          isClient ? 'bg-brand-primary' : 'bg-purple-600'
                        }`}>
                          {isClient ? 'C' : 'S'}
                        </div>
                        <div className={`flex-1 border p-4 rounded-sm ${
                          isClient ? 'bg-bg-base/50 border-border-subtle/50' : 'bg-purple-950/5 border-purple-500/20'
                        }`}>
                          <div className="flex items-center justify-between text-[8px] font-mono text-text-muted mb-2">
                            <span className={isClient ? 'text-text-muted' : 'text-purple-400 font-bold'}>
                              {isClient ? 'CLIENT REPLY' : 'HAWKEDGE SUPPORT RESPONDER'}
                            </span>
                            <span>{new Date(reply.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-text-secondary whitespace-pre-wrap">
                            {reply.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== 'RESOLVED' ? (
                  <form onSubmit={handleSendReply} className="p-4 border-t border-border-subtle bg-bg-surface/50 flex gap-3 items-end">
                    <textarea
                      placeholder="Type reply message coordinates..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="flex-1 bg-bg-base border border-border-subtle p-3 font-mono text-[10px] text-text-primary focus:outline-none focus:border-brand-primary rounded-xs resize-none placeholder:text-text-muted/40"
                    />
                    <button
                      type="submit"
                      disabled={replying || !replyText.trim()}
                      className="px-4 py-3 bg-brand-primary hover:bg-brand-hover disabled:opacity-50 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> {replying ? '...' : 'SEND'}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 border-t border-border-subtle bg-bg-base/30 text-center font-mono text-[9px] text-semantic-success flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> TICKET RESOLVED & ARCHIVED ON LEDGER
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {newTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-bg-base/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border-subtle rounded-md w-full max-w-xl overflow-hidden shadow-modal">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-brand-primary" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-text-primary">
                  Open support channel
                </h3>
              </div>
              <button onClick={() => setNewTicketModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. DNS Integration failure or Billing mismatch"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-2 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  >
                    <option value="GENERAL">GENERAL DISCUSSIONS</option>
                    <option value="TECHNICAL">TECHNICAL ISSUES</option>
                    <option value="BILLING">COMMERCIALS & ENQUIRIES</option>
                    <option value="BUG">SYSTEM COMPILING BUGS</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] px-2 py-2 focus:outline-none focus:border-brand-primary rounded-xs"
                  >
                    <option value="LOW">LOW PRIORITY</option>
                    <option value="NORMAL">NORMAL DELIVERY</option>
                    <option value="HIGH">HIGH ACCELERATED</option>
                    <option value="URGENT">URGENT PRODUCTION SPRINT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[8px] text-text-muted uppercase block mb-1">Description Brief</label>
                <textarea
                  placeholder="Articulate the systems parameters, expected behavior, and error trace coordinates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary font-mono text-[10px] p-3 focus:outline-none focus:border-brand-primary rounded-xs resize-none placeholder:text-text-muted/40"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border-subtle mt-4">
                <button
                  type="button"
                  onClick={() => setNewTicketModalOpen(false)}
                  className="px-4 py-2 font-mono text-[9px] uppercase tracking-wider border border-border-default text-text-muted hover:text-text-primary transition-all rounded-xs"
                >
                  DISCARD
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-mono text-[9px] uppercase tracking-wider bg-brand-primary hover:bg-brand-hover text-white transition-all rounded-xs"
                >
                  {submitting ? '...' : 'SUBMIT TICKET'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
