// Neon Data API — HTTP-based SQL queries using the REST endpoint.
// This replaces the WebSocket connection string approach and works
// perfectly in Vercel serverless / edge environments.

const NEON_DATA_API_URL = process.env.NEON_DATA_API_URL;
const NEON_DB_PASSWORD = process.env.NEON_DB_PASSWORD;

// Fallback to parsing DATABASE_URL if the dedicated env vars aren't set
function getApiConfig(): { url: string; password: string } {
  if (NEON_DATA_API_URL && NEON_DB_PASSWORD) {
    return { url: NEON_DATA_API_URL, password: NEON_DB_PASSWORD };
  }

  // Derive from DATABASE_URL as fallback
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const parsed = new URL(dbUrl);
      const host = parsed.hostname.replace("-pooler", "");
      const dbName = parsed.pathname.replace("/", "");
      const password = parsed.password;
      const region = host.split(".").slice(1).join(".");
      const projectId = host.split(".")[0];
      return {
        url: `https://${projectId}.apirest.${region}/${dbName}/rest/v1`,
        password,
      };
    } catch {
      // fall through
    }
  }

  throw new Error(
    "Neon database config not found. Set NEON_DATA_API_URL + NEON_DB_PASSWORD or DATABASE_URL."
  );
}

/**
 * Execute raw SQL via the Neon Data API (HTTP).
 * Supports parameterised queries: sql("SELECT * FROM t WHERE id = $1", [id])
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = Record<string, any>>(
  sqlText: string,
  params: unknown[] = []
): Promise<T[]> {
  const { url, password } = getApiConfig();

  // PostgREST doesn't support raw SQL — use the Neon HTTP SQL endpoint instead
  // Strip the /rest/v1 suffix to get the project API base
  const baseUrl = url.replace(/\/rest\/v1\/?$/, "");
  const endpoint = `${baseUrl}/sql`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${password}`,
      "Neon-Connection-String": process.env.DATABASE_URL ?? "",
    },
    body: JSON.stringify({ query: sqlText, params }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon query failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  // Neon HTTP API returns { rows: [...], fields: [...] }
  return (json.rows ?? json) as T[];
}

/**
 * Tagged-template helper — mirrors the @neondatabase/serverless `sql` API.
 * Usage: await getSql()`SELECT * FROM table WHERE id = ${id}`
 */
export function getSql() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function sqlTag(strings: TemplateStringsArray, ...values: any[]) {
    // Build parameterised query from the template literal
    let sqlText = "";
    const params: unknown[] = [];
    strings.forEach((str, i) => {
      sqlText += str;
      if (i < values.length) {
        params.push(values[i]);
        sqlText += `$${params.length}`;
      }
    });
    return query(sqlText.trim(), params);
  };
}
