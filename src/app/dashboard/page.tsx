import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

// Ensure this route is fully dynamic so it fetches fresh bookings on every visit
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toStr(v: any): string {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawBookings: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawInquiries: any[] = [];

  try {
    const result = await sql`
      SELECT id, full_name, email, phone, company, preferred_date, preferred_time, purpose, message, created_at
      FROM consultation_bookings
      ORDER BY created_at DESC;
    `;
    rawBookings = [...result];
  } catch (error) {
    console.error("Failed to fetch consultation bookings from database:", error);
  }

  try {
    const result = await sql`
      SELECT id, full_name, company, email, phone, country, linkedin, website, services, project_title, description, business_goal, target_audience, expected_features, technologies, existing_website, budget, timeline, deadline, file_url, created_at
      FROM project_inquiries
      ORDER BY created_at DESC;
    `;
    rawInquiries = [...result];
  } catch (error) {
    console.error("Failed to fetch project inquiries from database:", error);
  }

  // Serialize: convert all Date objects to ISO strings for safe client transfer
  const serializedBookings = rawBookings.map((b) => ({
    id: Number(b.id),
    full_name: String(b.full_name ?? ""),
    email: String(b.email ?? ""),
    phone: String(b.phone ?? ""),
    company: b.company ? String(b.company) : null,
    preferred_date: String(b.preferred_date ?? ""),
    preferred_time: String(b.preferred_time ?? ""),
    purpose: String(b.purpose ?? ""),
    message: b.message ? String(b.message) : null,
    created_at: toStr(b.created_at),
  }));

  const serializedInquiries = rawInquiries.map((i) => ({
    id: Number(i.id),
    full_name: String(i.full_name ?? ""),
    company: i.company ? String(i.company) : null,
    email: String(i.email ?? ""),
    phone: i.phone ? String(i.phone) : null,
    country: i.country ? String(i.country) : null,
    linkedin: i.linkedin ? String(i.linkedin) : null,
    website: i.website ? String(i.website) : null,
    services: Array.isArray(i.services) ? i.services.map(String) : [],
    project_title: String(i.project_title ?? ""),
    description: String(i.description ?? ""),
    business_goal: String(i.business_goal ?? ""),
    target_audience: String(i.target_audience ?? ""),
    expected_features: String(i.expected_features ?? ""),
    technologies: i.technologies ? String(i.technologies) : null,
    existing_website: i.existing_website ? String(i.existing_website) : null,
    budget: String(i.budget ?? ""),
    timeline: String(i.timeline ?? ""),
    deadline: i.deadline ? String(i.deadline) : null,
    file_url: i.file_url ? String(i.file_url) : null,
    created_at: toStr(i.created_at),
  }));

  return (
    <div className="bg-light-gray/50 min-h-screen pt-4 pb-16">
      <DashboardClient
        initialBookings={serializedBookings}
        initialInquiries={serializedInquiries}
        adminUsername={session.username}
      />
    </div>
  );
}
