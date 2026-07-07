import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';
import { signAccessToken } from '@hawkedge/auth';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'hawkedge_access_secret_key_development_only_change_in_production';

// Cache for simulated client token to prevent database calls on every proxy request
let cachedSimulatedToken: string | null = null;
let tokenExpiryTime = 0;

async function getSimulatedClientToken(): Promise<string> {
  const now = Date.now();
  if (cachedSimulatedToken && now < tokenExpiryTime) {
    return cachedSimulatedToken;
  }

  // Find the seeded client user from database
  let clientUser = await prisma.user.findUnique({
    where: { email: 'client@logixflow.com' },
  });

  // If database not seeded yet or no client user, find the first user with rank CLIENT
  if (!clientUser) {
    clientUser = await prisma.user.findFirst({
      where: { rank: 'CLIENT' },
    });
  }

  // If absolutely no user exists, create a temporary seed user
  if (!clientUser) {
    clientUser = await prisma.user.create({
      data: {
        email: 'client@logixflow.com',
        status: 'ACTIVE',
        rank: 'CLIENT',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Sarah',
            lastName: 'Jenkins',
            companyName: 'LogixFlow Global',
          },
        },
      },
    });
  }

  // Sign a real access token valid for 1 hour
  const token = await signAccessToken(
    {
      sub: clientUser.id,
      email: clientUser.email,
      rank: clientUser.rank,
      status: clientUser.status,
      sessionId: 'simulated_session_id_12345',
    },
    JWT_SECRET,
    '1h'
  );

  cachedSimulatedToken = `Bearer ${token}`;
  tokenExpiryTime = now + 50 * 60 * 1000; // 50 minutes cache
  return cachedSimulatedToken;
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params;
  const pathStr = path ? path.join('/') : '';
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';

  const targetUrl = `${API_BASE}/studio/${pathStr}${queryString}`;

  // Copy request headers
  const headers = new Headers();
  request.headers.forEach((val, key) => {
    // Avoid host header forwarding
    if (key.toLowerCase() !== 'host') {
      headers.set(key, val);
    }
  });

  // Inject token if authorization header not present
  if (!headers.has('authorization')) {
    try {
      const simulatedToken = await getSimulatedClientToken();
      headers.set('authorization', simulatedToken);
    } catch (e) {
      console.error('Failed to generate simulated client token:', e);
    }
  }

  // Parse body if it is a write request
  let body: string | undefined = undefined;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    try {
      body = await request.text();
    } catch {
      body = undefined;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await res.text();
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return NextResponse.json(parsedData, { status: res.status });
  } catch (err) {
    console.error(`Studio proxy error to ${targetUrl}:`, err);
    return NextResponse.json({ error: 'Studio proxy connection failed.' }, { status: 502 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, context);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleProxy(req, context);
}
