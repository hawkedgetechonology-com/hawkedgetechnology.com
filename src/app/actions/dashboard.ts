"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteBooking(id: number) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await sql`
      DELETE FROM consultation_bookings WHERE id = ${id};
    `;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

export async function deleteInquiry(id: number) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await sql`
      DELETE FROM project_inquiries WHERE id = ${id};
    `;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return { success: false, error: "Failed to delete inquiry" };
  }
}
