import { neon, NeonQueryFunction } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not defined in your environment variables. Database actions will fail."
  );
}

// Lazily initialise — only connects when first query runs, NOT at module import time.
// This prevents Vercel build-time crashes when DATABASE_URL is absent from the build env.
let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not defined in your environment variables."
      );
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}
