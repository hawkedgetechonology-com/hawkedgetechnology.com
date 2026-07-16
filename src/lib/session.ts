import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET || "default-secret-string-at-least-32-chars-long";
const COOKIE_NAME = "admin_session";

// Derive a 32-byte key from the secret
const KEY = crypto.createHash("sha256").update(SESSION_SECRET).digest();

export interface SessionPayload {
  username: string;
  role: string;
  expiresAt: string;
}

export function encryptSession(payload: SessionPayload): string {
  const iv = crypto.randomBytes(12); // 12-byte IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  return JSON.stringify({
    iv: iv.toString("hex"),
    tag: authTag.toString("hex"),
    data: encrypted.toString("hex")
  });
}

export function decryptSession(token: string): SessionPayload | null {
  try {
    const { iv, tag, data } = JSON.parse(token);
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(data, "hex")),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString("utf8"));
  } catch (err) {
    return null;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === verifyHash;
  } catch (e) {
    return false;
  }
}

export async function createSession(username: string, role: string = "admin") {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day expiration
  const session = encryptSession({ username, role, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  
  const payload = decryptSession(sessionCookie);
  if (!payload) return null;
  
  // Check expiration
  if (new Date(payload.expiresAt) < new Date()) {
    await deleteSession();
    return null;
  }
  
  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
