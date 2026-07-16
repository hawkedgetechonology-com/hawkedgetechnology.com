"use client";

import React, { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { deleteBooking, deleteInquiry } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Trash2,
  Eye,
  LogOut,
  Search,
  Clock,
  Shield,
  FileText,
  X,
  Building,
  User,
  ExternalLink,
  DollarSign,
  Compass,
  CheckCircle,
} from "lucide-react";

interface ConsultationBooking {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  preferred_date: string;
  preferred_time: string;
  purpose: string;
  message: string | null;
  created_at: string;
}

interface ProjectInquiry {
  id: number;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  linkedin: string | null;
  website: string | null;
  services: string[];
  project_title: string;
  description: string;
  business_goal: string;
  target_audience: string;
  expected_features: string;
  technologies: string | null;
  existing_website: string | null;
  budget: string;
  timeline: string;
  deadline: string | null;
  file_url: string | null;
  created_at: string;
}

interface DashboardClientProps {
  initialBookings: ConsultationBooking[];
  initialInquiries: ProjectInquiry[];
  adminUsername: string;
}

export function DashboardClient({
  initialBookings,
  initialInquiries,
  adminUsername,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"consultations" | "inquiries">("consultations");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<ConsultationBooking[]>(initialBookings);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>(initialInquiries);
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
  
  // Deleting state
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  // Search logic
  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.full_name.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      (b.company && b.company.toLowerCase().includes(query)) ||
      b.purpose.toLowerCase().includes(query)
    );
  });

  const filteredInquiries = inquiries.filter((i) => {
    const query = searchQuery.toLowerCase();
    return (
      i.full_name.toLowerCase().includes(query) ||
      i.email.toLowerCase().includes(query) ||
      (i.company && i.company.toLowerCase().includes(query)) ||
      i.project_title.toLowerCase().includes(query)
    );
  });

  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Are you sure you want to delete this consultation booking?")) return;
    setIsDeletingId(id);
    const res = await deleteBooking(id);
    if (res.success) {
      setBookings(bookings.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
    } else {
      alert("Error: " + res.error);
    }
    setIsDeletingId(null);
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project inquiry?")) return;
    setIsDeletingId(id);
    const res = await deleteInquiry(id);
    if (res.success) {
      setInquiries(inquiries.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } else {
      alert("Error: " + res.error);
    }
    setIsDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-color pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-heading text-secondary">
              Admin Dashboard
            </h1>
            <span className="bg-soft-blue text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
              Active Session
            </span>
          </div>
          <p className="text-foreground/75 mt-1">
            Welcome, <span className="font-semibold text-secondary">{adminUsername}</span>. Monitor and manage your consultation bookings and project inquiries.
          </p>
        </div>
        <div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </form>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-border-color shadow-sm flex items-center gap-4 bg-white">
          <div className="h-12 w-12 rounded-xl bg-soft-blue flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Total Consultations</p>
            <p className="text-2xl font-bold text-secondary">{bookings.length}</p>
          </div>
        </Card>

        <Card className="p-6 border-border-color shadow-sm flex items-center gap-4 bg-white">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-secondary">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Total Project Inquiries</p>
            <p className="text-2xl font-bold text-secondary">{inquiries.length}</p>
          </div>
        </Card>

        <Card className="p-6 border-border-color shadow-sm flex items-center gap-4 bg-white col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Active Database</p>
            <p className="text-2xl font-bold text-secondary">Neon PostgreSQL</p>
          </div>
        </Card>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-border-color shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-light-gray rounded-lg border border-border-color w-fit">
          <button
            onClick={() => {
              setActiveTab("consultations");
              setSearchQuery("");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "consultations"
                ? "bg-white text-secondary shadow-sm"
                : "text-foreground/75 hover:text-secondary"
            }`}
          >
            Consultation Bookings ({bookings.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("inquiries");
              setSearchQuery("");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-white text-secondary shadow-sm"
                : "text-foreground/75 hover:text-secondary"
            }`}
          >
            Project Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
            <Search size={18} />
          </div>
          <Input
            type="text"
            placeholder={`Search ${activeTab === "consultations" ? "bookings" : "inquiries"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-border-color rounded-xl shadow-sm overflow-hidden">
        {activeTab === "consultations" ? (
          /* CONSULTATIONS TAB */
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-foreground/60">
                <Calendar className="mx-auto h-12 w-12 text-foreground/35 mb-4" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Either no clients have booked yet, or your search filter yielded no results.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-light-gray border-b border-border-color text-xs font-semibold text-secondary uppercase tracking-wider">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-soft-blue/20 transition-colors text-sm">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-secondary">{b.full_name}</div>
                        {b.company && (
                          <div className="text-xs text-foreground/60 flex items-center gap-1 mt-0.5">
                            <Building size={12} /> {b.company}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-foreground/80">
                          <Mail size={12} className="text-primary" /> {b.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-foreground/80 mt-1">
                          <Phone size={12} className="text-primary" /> {b.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <Calendar size={12} className="text-primary" /> {b.preferred_date}
                        </div>
                        <div className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {b.preferred_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-soft-blue text-primary border border-primary/20">
                          {b.purpose}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-foreground/60">
                        {formatDate(b.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-secondary cursor-pointer"
                            onClick={() => setSelectedBooking(b)}
                          >
                            <Eye size={14} />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-red-100 text-red-600 hover:bg-red-50 cursor-pointer"
                            disabled={isDeletingId === b.id}
                            onClick={() => handleDeleteBooking(b.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          /* PROJECT INQUIRIES TAB */
          <div className="overflow-x-auto">
            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-foreground/60">
                <Briefcase className="mx-auto h-12 w-12 text-foreground/35 mb-4" />
                <p className="text-lg font-medium">No inquiries found</p>
                <p className="text-sm">Either no clients have submitted inquiries, or your search filter yielded no results.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-light-gray border-b border-border-color text-xs font-semibold text-secondary uppercase tracking-wider">
                    <th className="px-6 py-4">Client / Project</th>
                    <th className="px-6 py-4">Contact & Location</th>
                    <th className="px-6 py-4">Budget & Timeline</th>
                    <th className="px-6 py-4">Selected Services</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {filteredInquiries.map((i) => (
                    <tr key={i.id} className="hover:bg-soft-blue/20 transition-colors text-sm">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-secondary">{i.full_name}</div>
                        {i.company && (
                          <div className="text-xs text-foreground/60 flex items-center gap-1 mt-0.5">
                            <Building size={12} /> {i.company}
                          </div>
                        )}
                        <div className="text-xs font-medium text-primary mt-1 border-t border-dashed border-border-color/60 pt-1">
                          {i.project_title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-foreground/80">
                          <Mail size={12} className="text-primary" /> {i.email}
                        </div>
                        {i.phone && (
                          <div className="flex items-center gap-1 text-xs text-foreground/80 mt-1">
                            <Phone size={12} className="text-primary" /> {i.phone}
                          </div>
                        )}
                        {i.country && (
                          <div className="text-xs text-foreground/60 mt-1">
                            Country: <span className="font-medium text-foreground/85">{i.country}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <DollarSign size={12} className="text-green-600" /> Budget: {i.budget}
                        </div>
                        <div className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
                          <Clock size={12} /> Timeline: {i.timeline}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {i.services.map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-soft-blue text-primary border border-primary/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-foreground/60">
                        {formatDate(i.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-secondary cursor-pointer"
                            onClick={() => setSelectedInquiry(i)}
                          >
                            <Eye size={14} />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-red-100 text-red-600 hover:bg-red-50 cursor-pointer"
                            disabled={isDeletingId === i.id}
                            onClick={() => handleDeleteInquiry(i.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL: CONSULTATIONS */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border-color shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-color bg-light-gray">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded">
                  Consultation Booking Detail
                </span>
                <h3 className="text-xl font-bold font-heading text-secondary mt-1">
                  {selectedBooking.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-lg hover:bg-border-color transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Business Email</span>
                  <a
                    href={`mailto:${selectedBooking.email}`}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail size={14} /> {selectedBooking.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Phone Number</span>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="text-sm font-medium text-secondary hover:underline flex items-center gap-1"
                  >
                    <Phone size={14} /> {selectedBooking.phone}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Company</span>
                  <div className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Building size={14} className="text-foreground/45" />{" "}
                    {selectedBooking.company || "Not provided"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Purpose</span>
                  <div className="text-sm font-semibold text-primary">{selectedBooking.purpose}</div>
                </div>
              </div>

              <div className="border-t border-border-color/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Preferred Date</span>
                  <div className="text-sm font-medium text-secondary flex items-center gap-1">
                    <Calendar size={14} className="text-primary" /> {selectedBooking.preferred_date}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Preferred Time</span>
                  <div className="text-sm font-medium text-secondary flex items-center gap-1">
                    <Clock size={14} className="text-primary" /> {selectedBooking.preferred_time}
                  </div>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="border-t border-border-color/80 pt-4 space-y-2">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Message / Notes</span>
                  <div className="text-sm text-foreground/80 bg-light-gray p-4 rounded-xl border border-border-color/60 whitespace-pre-line leading-relaxed font-sans">
                    {selectedBooking.message}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-light-gray border-t border-border-color flex justify-between gap-3">
              <span className="text-[10px] text-foreground/55 self-center">
                Submitted on: {formatDate(selectedBooking.created_at)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                  className="cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="border-red-100 text-red-600 hover:bg-red-50 cursor-pointer"
                  disabled={isDeletingId === selectedBooking.id}
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                >
                  Delete Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: PROJECT INQUIRIES */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border-color shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-color bg-light-gray">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded">
                  Project Inquiry Detail
                </span>
                <h3 className="text-xl font-bold font-heading text-secondary mt-1">
                  {selectedInquiry.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-foreground/50 hover:text-foreground p-1.5 rounded-lg hover:bg-border-color transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Business Email</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail size={14} /> {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Phone Number</span>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-sm font-medium text-secondary hover:underline flex items-center gap-1"
                    >
                      <Phone size={14} /> {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Company / Agency</span>
                  <div className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Building size={14} className="text-foreground/45" />{" "}
                    {selectedInquiry.company || "Not provided"}
                  </div>
                </div>
                {selectedInquiry.country && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Country</span>
                    <div className="text-sm font-medium text-foreground">{selectedInquiry.country}</div>
                  </div>
                )}
              </div>

              {/* Socials / External links */}
              {(selectedInquiry.linkedin || selectedInquiry.website) && (
                <div className="border-t border-border-color/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedInquiry.linkedin && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-foreground/50 uppercase block">LinkedIn Profile</span>
                      <a
                        href={selectedInquiry.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Profile <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {selectedInquiry.website && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-foreground/50 uppercase block">Existing Website</span>
                      <a
                        href={selectedInquiry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {selectedInquiry.website.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Budget and Timeline */}
              <div className="border-t border-border-color/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Budget Range</span>
                  <div className="text-sm font-semibold text-green-700 flex items-center gap-1 bg-green-50 px-2 py-1 rounded w-fit border border-green-100">
                    <DollarSign size={14} /> {selectedInquiry.budget}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Estimated Timeline</span>
                  <div className="text-sm font-semibold text-secondary flex items-center gap-1 bg-soft-blue px-2 py-1 rounded w-fit border border-primary/10">
                    <Clock size={14} /> {selectedInquiry.timeline}
                  </div>
                </div>
              </div>

              {/* Project description */}
              <div className="border-t border-border-color/80 pt-4 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Services Requested</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedInquiry.services.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-soft-blue text-primary border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Project Title</span>
                  <div className="text-base font-bold text-secondary">{selectedInquiry.project_title}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Description</span>
                  <div className="text-sm text-foreground/80 bg-light-gray p-4 rounded-xl border border-border-color/60 whitespace-pre-line leading-relaxed">
                    {selectedInquiry.description}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground/50 uppercase block">Business Goals</span>
                  <div className="text-sm text-foreground/80 bg-light-gray p-4 rounded-xl border border-border-color/60 whitespace-pre-line leading-relaxed">
                    {selectedInquiry.business_goal}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Target Audience</span>
                    <div className="text-sm text-foreground/80 bg-light-gray p-3 rounded-lg border border-border-color/60">
                      {selectedInquiry.target_audience}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Expected Core Features</span>
                    <div className="text-sm text-foreground/80 bg-light-gray p-3 rounded-lg border border-border-color/60">
                      {selectedInquiry.expected_features}
                    </div>
                  </div>
                </div>

                {selectedInquiry.technologies && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Preferred Technologies</span>
                    <div className="text-sm text-foreground/80 font-mono">{selectedInquiry.technologies}</div>
                  </div>
                )}

                {selectedInquiry.file_url && (
                  <div className="space-y-1 pt-2">
                    <span className="text-xs font-semibold text-foreground/50 uppercase block">Attached File / URL</span>
                    <a
                      href={selectedInquiry.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5 bg-soft-blue/60 p-2.5 rounded-lg border border-primary/20"
                    >
                      <FileText size={16} /> View Attached Document <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-light-gray border-t border-border-color flex justify-between gap-3">
              <span className="text-[10px] text-foreground/55 self-center">
                Submitted on: {formatDate(selectedInquiry.created_at)}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  className="cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="border-red-100 text-red-600 hover:bg-red-50 cursor-pointer"
                  disabled={isDeletingId === selectedInquiry.id}
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                >
                  Delete Inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
