"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginActionResult =
  | { success: true; redirectTo: string; isNewUser: boolean }
  | { error: string };

// ── Shared helper: persist token in HttpOnly cookie + derive redirect ──────
async function persistToken(
  token: string,
  role: string
): Promise<string> {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });

  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "STAFF") return "/dashboard";
  return "/workspace";
}

// ── Smart Login/Register action ────────────────────────────────────────────
// 1. Try to log in the user.
// 2. If the server returns 401 (wrong password for existing user) → surface error.
// 3. If the server returns 404 / user not found → auto-register then sign in.
export async function loginAction(
  formData: FormData
): Promise<LoginActionResult> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const credentials = validation.data;

  // ── Step 1: Attempt login ────────────────────────────────────────────────
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      const redirectTo = await persistToken(data.access_token, data.role ?? "CLIENT");
      return { success: true, redirectTo, isNewUser: false };
    }

    // Wrong password for an existing account
    if (loginRes.status === 401) {
      return { error: "Incorrect password. Please try again." };
    }

    // Any other non-OK status — fall through to register attempt
  } catch {
    return { error: "Could not connect to the server. Please try again." };
  }

  // ── Step 2: User doesn't exist — auto-register ───────────────────────────
  try {
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    if (!registerRes.ok) {
      const body = await registerRes.json().catch(() => ({}));
      const message =
        body?.message ?? "Registration failed. Please try again.";
      return { error: Array.isArray(message) ? message[0] : message };
    }

    // ── Step 3: Auto-sign in after successful registration ─────────────────
    const loginRes2 = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!loginRes2.ok) {
      return {
        error:
          "Account created but could not sign you in automatically. Please sign in manually.",
      };
    }

    const data = await loginRes2.json();
    const redirectTo = await persistToken(data.access_token, data.role ?? "CLIENT");
    return { success: true, redirectTo, isNewUser: true };
  } catch {
    return { error: "Could not connect to the server. Please try again." };
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
