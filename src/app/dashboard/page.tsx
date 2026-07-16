import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

// Ensure this route is fully dynamic so it fetches fresh bookings on every visit
export const dynamic = "force-dynamic";

interface DBBooking {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  preferred_date: string;
  preferred_time: string;
  purpose: string;
  message: string | null;
  created_at: Date | string;
}

interface DBInquiry {
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
  created_at: Date | string;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  let bookings: DBBooking[] = [];
  let inquiries: DBInquiry[] = [];

  try {
    // Fetch data directly from Neon database on the server
    bookings = (await sql`
      SELECT id, full_name, email, phone, company, preferred_date, preferred_time, purpose, message, created_at
      FROM consultation_bookings
      ORDER BY created_at DESC;
    `) as unknown as DBBooking[];
  } catch (error) {
    console.error("Failed to fetch consultation bookings from database:", error);
  }

  try {
    inquiries = (await sql`
      SELECT id, full_name, company, email, phone, country, linkedin, website, services, project_title, description, business_goal, target_audience, expected_features, technologies, existing_website, budget, timeline, deadline, file_url, created_at
      FROM project_inquiries
      ORDER BY created_at DESC;
    `) as unknown as DBInquiry[];
  } catch (error) {
    console.error("Failed to fetch project inquiries from database:", error);
  }

  // Serialize date objects for passing down to the Client Component
  const serializedBookings = bookings.map((b) => ({
    ...b,
    created_at: b.created_at instanceof Date ? b.created_at.toISOString() : String(b.created_at),
  }));

  const serializedInquiries = inquiries.map((i) => ({
    ...i,
    created_at: i.created_at instanceof Date ? i.created_at.toISOString() : String(i.created_at),
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
