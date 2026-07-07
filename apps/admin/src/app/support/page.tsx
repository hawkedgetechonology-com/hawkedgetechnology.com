'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Send,
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
  user: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      companyName: string | null;
    } | null;
  };
}

export default function SupportQueue() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    avgResponseTimeHours: 0,
    slaCompliance: '',
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  // Response form state
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Edit ticket state
  const [editPriority, setEditPriority] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const fetchSupportData = async () => {
    try {
      const res = await fetch('/api/support');
      const data = await res.json();
      setTickets(data.tickets);
      setStats(data.stats);
      if (data.tickets.length > 0) {
        setSelectedTicket((prev) => {
          const found = data.tickets.find((t: Ticket) => t.id === prev?.id);
          return found || data.tickets[0];
        });
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportData();
  }, []);

  const handleUpdateTicket = async (ticketId: string, status: string, priority: string) => {
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });
      if (res.ok) {
        fetchSupportData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);

    try {
      const res = await fetch(`/api/support/${selectedTicket.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        setReplyText('');
        fetchSupportData();
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
        <span>// DIALING INTERNAL COM DIRECTORY...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          MASTER SERVICE LEVEL AGREEMENT QUEUE
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Support Center Queue
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Audit client support registries, execute ticket resolutions, and verify SLA response metrics compliance.
        </p>
      </div>

      {/* SLA Metrics KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Support queue', value: stats.openTickets, sub: 'Requires analyst attention' },
          { label: 'In Progress Tickets', value: stats.inProgressTickets, sub: 'Sprint resolution ongoing' },
          { label: 'Avg response duration', value: `${stats.avgResponseTimeHours} hrs`, sub: 'SLA target: 4.0 hrs' },
          { label: 'SLA compliance score', value: stats.slaCompliance, sub: 'Realtime node latency score' },
        ].map((card, idx) => (
          <div key={idx} className="border border-border-subtle bg-bg-surface/35 p-5 rounded-md">
            <span className="font-mono text-[9px] text-text-muted uppercase block mb-3">{card.label}</span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-text-primary mb-1">
              {card.value}
            </div>
            <span className="font-mono text-[8px] text-text-muted/65 uppercase block">{card.sub}</span>
          </div>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <LifeBuoy className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            All Queues Resolved
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            No active support tickets found in database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel ticket directories */}
          <div className="lg:col-span-4 border border-border-subtle bg-bg-surface/35 p-4 rounded-md h-[calc(100vh-280px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4 font-mono text-[9px] text-text-muted">
              <span>Support Registries</span>
              <span>{tickets.length} Tickets</span>
            </div>

            <div className="space-y-2">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTicket(t);
                    setEditPriority(t.priority);
                    setEditStatus(t.status);
                  }}
                  className={`p-4 border rounded-sm cursor-pointer transition-all ${
                    selectedTicket?.id === t.id
                      ? 'border-purple-400 bg-purple-900/10'
                      : 'border-border-subtle/50 bg-bg-base/20 hover:border-border-default'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-mono text-[7px] border px-1.5 py-0.5 rounded-full ${
                      t.priority === 'URGENT' || t.priority === 'HIGH'
                        ? 'border-semantic-danger/35 text-semantic-danger bg-semantic-danger-bg/10'
                        : 'border-border-default text-text-muted'
                    }`}>
                      {t.priority}
                    </span>
                    <span className={`font-mono text-[8px] uppercase tracking-wider ${
                      t.status === 'OPEN' ? 'text-rose-400' : t.status === 'IN_PROGRESS' ? 'text-amber-400' : 'text-semantic-success'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xs text-text-primary truncate">
                    {t.subject}
                  </h3>
                  <p className="font-mono text-[8px] text-text-muted mt-1 truncate">
                    Company: {t.user.profile?.companyName || 'Corporate'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel message logs */}
          {selectedTicket && (
            <div className="lg:col-span-8 border border-border-subtle bg-bg-surface/35 rounded-md flex flex-col h-[calc(100vh-280px)]">
              {/* Message Header */}
              <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-surface/50">
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary">
                    {selectedTicket.subject}
                  </h3>
                  <p className="font-mono text-[8px] text-text-muted mt-1 uppercase">
                    ID: {selectedTicket.id.toUpperCase()} &bull; Client: {selectedTicket.user.profile?.firstName} ({selectedTicket.user.profile?.companyName || 'Corporate'})
                  </p>
                </div>

                {/* Edit details status & priority */}
                <div className="flex items-center gap-2 font-mono text-[8.5px]">
                  <select
                    value={editPriority}
                    onChange={(e) => {
                      setEditPriority(e.target.value);
                      handleUpdateTicket(selectedTicket.id, editStatus, e.target.value);
                    }}
                    className="bg-bg-base border border-border-subtle text-text-primary px-2 py-1 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                  <select
                    value={editStatus}
                    onChange={(e) => {
                      setEditStatus(e.target.value);
                      handleUpdateTicket(selectedTicket.id, e.target.value, editPriority);
                    }}
                    className="bg-bg-base border border-border-subtle text-text-primary px-2 py-1 focus:outline-none"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>

              {/* Message Conversation */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Client original query */}
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-mono font-bold text-white text-[10px] flex-shrink-0">
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

                {/* Responses list */}
                {parseReplies(selectedTicket.response).map((reply, idx) => {
                  const isClient = reply.author.toLowerCase().includes('client');
                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-white text-[10px] flex-shrink-0 ${
                        isClient ? 'bg-purple-500' : 'bg-brand-primary'
                      }`}>
                        {isClient ? 'C' : 'A'}
                      </div>
                      <div className={`flex-1 border p-4 rounded-sm ${
                        isClient ? 'bg-bg-base/50 border-border-subtle/50' : 'bg-brand-primary/5 border-brand-primary/20'
                      }`}>
                        <div className="flex items-center justify-between text-[8px] font-mono text-text-muted mb-2">
                          <span className={isClient ? 'text-text-muted' : 'text-brand-primary font-bold'}>
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
                    placeholder="Type support response coordinates..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    className="flex-1 bg-bg-base border border-border-subtle p-3 font-mono text-[10px] text-text-primary focus:outline-none focus:border-purple-400 rounded-xs resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={replying || !replyText.trim()}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> {replying ? '...' : 'RESPOND'}
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-border-subtle bg-bg-base/30 text-center font-mono text-[9px] text-semantic-success flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> TICKET RESOLVED & CLOSED
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
