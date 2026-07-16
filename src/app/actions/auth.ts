"use server";

import { z } from "zod";
import { sql } from "@/lib/db";
import { createSession, deleteSession, verifyPassword } from "@/lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ username, password });
  if (!result.success) {
    return { error: "Username and password are required" };
  }

  let success = false;
  try {
    // Look up user in Neon DB
    const users = await sql`
      SELECT id, username, password_hash, role 
      FROM users 
      WHERE username = ${username} 
      LIMIT 1;
    `;

    if (users.length === 0) {
      return { error: "Invalid username or password" };
    }

    const user = users[0];
    const isPasswordCorrect = verifyPassword(password, user.password_hash);
    if (!isPasswordCorrect) {
      return { error: "Invalid username or password" };
    }

    // Set cookie session
    await createSession(user.username, user.role);
    success = true;
  } catch (err) {
    console.error("Login failed:", err);
    return { error: "Internal server error during login" };
  }

  // Redirect outside the try-catch block to prevent Next.js from catching the redirect error
  if (success) {
    redirect("/dashboard");
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
