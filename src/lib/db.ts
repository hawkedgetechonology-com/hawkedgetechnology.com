import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  // We log a warning if DATABASE_URL is not set so the site doesn't crash on startup,
  // but form submissions will gracefully return an error if they attempt to write.
  console.warn("DATABASE_URL is not defined in your environment variables. Database actions will fail.");
}

export const sql = neon(process.env.DATABASE_URL || "");
