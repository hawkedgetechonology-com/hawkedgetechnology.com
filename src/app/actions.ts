"use server";

import { z } from "zod";
import { headers } from "next/headers";

// --- RATE LIMITING ---
// Simple in-memory rate limiter for serverless environment
// In production, use Redis or Upstash for distributed rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // Max 5 submissions
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function checkRateLimit(): Promise<{ success: boolean; error?: string }> {
  // In Next.js App Router, headers() is a synchronous-looking API but internally it relies on async context in later versions.
  // We use await to be safe with Next.js 15+ changes, but for Next 14, headers() is generally sync.
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (clientData) {
    if (now > clientData.resetTime) {
      // Reset window
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      return { success: true };
    }
    
    if (clientData.count >= RATE_LIMIT_MAX) {
      return { success: false, error: "Too many requests. Please try again later." };
    }
    
    clientData.count += 1;
    rateLimitMap.set(ip, clientData);
    return { success: true };
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { success: true };
  }
}

// --- VALIDATION SCHEMAS ---

const projectInquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  companyName: z.string().max(100).optional(),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().max(30).optional(),
  country: z.string().max(100).optional(),
  linkedin: z.string().max(200).optional(),
  website: z.string().max(200).optional(),
  services: z.array(z.string().max(50)).min(1, "Select at least one service"),
  projectTitle: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  businessGoal: z.string().min(20).max(2000),
  targetAudience: z.string().max(500),
  expectedFeatures: z.string().max(2000),
  preferredTechnologies: z.string().max(500).optional(),
  existingWebsite: z.string().max(200).optional(),
  budget: z.string().max(100),
  timeline: z.string().max(100),
  deadline: z.string().max(100).optional(),
  file: z.string().optional(),
});

const consultationSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(100),
  phone: z.string().max(30),
  company: z.string().max(100).optional(),
  preferredDate: z.string().max(50),
  preferredTime: z.string().max(50),
  purpose: z.string().max(500),
  message: z.string().max(2000).optional(),
});

export type ProjectInquiryData = z.infer<typeof projectInquirySchema>;
export type ConsultationData = z.infer<typeof consultationSchema>;

// --- ACTIONS ---

export async function submitProjectInquiry(rawData: ProjectInquiryData) {
  if (!process.env.DATABASE_URL) {
    return { success: false, error: "System configuration error" };
  }

  const rateLimitResult = await checkRateLimit();
  if (!rateLimitResult.success) {
    return { success: false, error: rateLimitResult.error };
  }

  // Strict server-side validation
  const validationResult = projectInquirySchema.safeParse(rawData);
  if (!validationResult.success) {
    return { success: false, error: "Invalid data format submitted" };
  }
  
  const data = validationResult.data;

  try {
    const res = await fetch('http://localhost:3333/leads/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to save inquiry');
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit project inquiry:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function submitConsultation(rawData: ConsultationData) {
  if (!process.env.DATABASE_URL) {
    return { success: false, error: "System configuration error" };
  }

  const rateLimitResult = await checkRateLimit();
  if (!rateLimitResult.success) {
    return { success: false, error: rateLimitResult.error };
  }

  // Strict server-side validation
  const validationResult = consultationSchema.safeParse(rawData);
  if (!validationResult.success) {
    return { success: false, error: "Invalid data format submitted" };
  }

  const data = validationResult.data;

  try {
    const res = await fetch('http://localhost:3333/leads/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to save consultation');
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit consultation booking:", error);
    return { success: false, error: "Internal server error" };
  }
}
