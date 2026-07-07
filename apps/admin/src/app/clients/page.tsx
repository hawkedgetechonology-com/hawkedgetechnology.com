'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search
} from 'lucide-react';

interface Profile {
  firstName: string;
  lastName: string;
  phone: string | null;
  companyName: string | null;
  companyWebsite: string | null;
  companyGst: string | null;
}

interface ClientTicket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  profile: Profile | null;
  projects: Array<{
    id: string;
    name: string;
    status: string;
    milestones: unknown[];
    invoices: unknown[];
  }>;
  supportRequests: ClientTicket[];
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        if (data.length > 0) {
          setSelectedClient(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
        setLoading(false);
      });
  }, []);

  const filteredClients = clients.filter((client) => {
    const name = `${client.profile?.firstName || ''} ${client.profile?.lastName || ''}`.toLowerCase();
    const company = (client.profile?.companyName || '').toLowerCase();
    const email = client.email.toLowerCase();
    const searchLower = search.toLowerCase();
    return name.includes(searchLower) || company.includes(searchLower) || email.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// FETCHING CLIENT WORKSPACE REGISTRIES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest block mb-1">
          MASTER PARTNERS LEDGER
        </span>
        <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-text-primary tracking-tight">
          Client Management
        </h1>
        <p className="font-sans text-xs text-text-muted mt-1">
          Inspect client account profiles, GST tax codes, company directories, and historical operations activity.
        </p>
      </div>

      {/* Control row */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search client directory or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-surface border border-border-subtle text-text-primary font-mono text-[10px] pl-10 pr-4 py-2 focus:outline-none focus:border-purple-400 rounded-xs transition-colors"
        />
      </div>

      {clients.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <Users className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            No Client Accounts
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            No registered client profiles retrieved in database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Client Directory */}
          <div className="lg:col-span-5 border border-border-subtle bg-bg-surface/35 p-4 rounded-md h-[calc(100vh-280px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4 font-mono text-[9px] text-text-muted">
              <span>Client Directories</span>
              <span>{filteredClients.length} Registries</span>
            </div>

            <div className="space-y-2">
              {filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-900/10'
                        : 'border-border-subtle/50 bg-bg-base/20 hover:border-border-default'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-heading font-bold text-xs text-text-primary truncate">
                        {client.profile?.firstName} {client.profile?.lastName}
                      </h3>
                      <span className={`font-mono text-[8px] border px-2 py-0.5 rounded-full ${
                        client.status === 'ACTIVE'
                          ? 'border-semantic-success/20 text-semantic-success bg-semantic-success-bg/10'
                          : 'border-border-default text-text-muted'
                      }`}>
                        {client.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono text-[9px] text-text-muted">
                      <span>{client.profile?.companyName || 'Private Partner'}</span>
                      <span>{client.projects.length} Projects</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Client Details */}
          {selectedClient && (
            <div className="lg:col-span-7 border border-border-subtle bg-bg-surface/35 p-6 rounded-md min-h-[500px] space-y-6">
              {/* Client header details */}
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <h2 className="font-heading font-extrabold text-lg tracking-tight text-text-primary">
                    {selectedClient.profile?.firstName} {selectedClient.profile?.lastName}
                  </h2>
                  <p className="font-mono text-[10px] text-text-muted mt-1">
                    Email: {selectedClient.email} &bull; Phone: {selectedClient.profile?.phone || 'No Phone Linked'}
                  </p>
                </div>
                <div className="font-mono text-[8px] bg-purple-950/20 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-xs uppercase">
                  CLIENT ID: {selectedClient.id.substring(0, 8).toUpperCase()}
                </div>
              </div>

              {/* Company parameters */}
              <div className="grid grid-cols-2 gap-6 bg-bg-base/30 p-4 border border-border-subtle/50 rounded-sm font-mono text-[10px] text-text-muted">
                <div>
                  <span className="block text-[8px] text-text-muted/65 uppercase">Company Name</span>
                  <span className="text-text-primary font-bold">{selectedClient.profile?.companyName || 'Corporate partner'}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-text-muted/65 uppercase">Corporate Website</span>
                  {selectedClient.profile?.companyWebsite ? (
                    <a
                      href={selectedClient.profile.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline inline-flex items-center gap-1"
                    >
                      {selectedClient.profile.companyWebsite}
                    </a>
                  ) : (
                    <span className="text-text-secondary">No Website Linked</span>
                  )}
                </div>
                <div>
                  <span className="block text-[8px] text-text-muted/65 uppercase">TAX GSTIN NO.</span>
                  <span className="text-text-primary font-bold">{selectedClient.profile?.companyGst || 'Not Registered'}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-text-muted/65 uppercase">Created On</span>
                  <span className="text-text-primary">{new Date(selectedClient.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Linked Projects list */}
              <div>
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wide block mb-3">Linked Projects & Workspaces</span>
                {selectedClient.projects.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-border-default font-mono text-[9px] text-text-muted">
                    No active SOW projects provisioned.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-[10px]">
                    {selectedClient.projects.map((proj) => (
                      <div key={proj.id} className="p-3 border border-border-subtle bg-bg-base/20 rounded-sm flex items-center justify-between">
                        <div>
                          <span className="text-text-primary font-bold">{proj.name}</span>
                          <span className="text-[8px] text-text-muted block mt-0.5">
                            Milestones: {proj.milestones.length} &bull; Invoices: {proj.invoices.length}
                          </span>
                        </div>
                        <span className={`text-[8px] border px-2 py-0.5 rounded-full ${
                          proj.status === 'IN_PROGRESS' ? 'border-purple-400 bg-purple-950/15 text-purple-400' : 'border-semantic-success/20 text-semantic-success'
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Support Center ticket history */}
              <div>
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wide block mb-3">Support Ticket logs</span>
                {selectedClient.supportRequests.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-border-default font-mono text-[9px] text-text-muted">
                    No support tickets opened by client.
                  </div>
                ) : (
                  <div className="space-y-2 font-mono text-[9px] text-text-muted">
                    {selectedClient.supportRequests.slice(0, 3).map((ticket: ClientTicket) => (
                      <div key={ticket.id} className="p-3 border border-border-subtle/50 bg-bg-base/10 rounded-sm flex justify-between items-center">
                        <div>
                          <span className="text-text-primary font-semibold">{ticket.subject}</span>
                          <span className="block text-[8px] text-text-muted/65 mt-0.5">Priority: {ticket.priority} &bull; Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 border rounded-xs ${
                          ticket.status === 'OPEN' ? 'border-red-500/20 text-red-400 bg-red-950/10' : 'border-green-500/20 text-green-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
