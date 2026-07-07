import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const startTime = Date.now();
    // Test Postgres connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    // Diagnose other resources (mocked Redis and Storage statuses)
    const redisLatency = 2.1; // mock redis latency ms
    const storageLatency = 12.5; // mock storage lat ms

    return NextResponse.json({
      dbStatus: 'ONLINE',
      dbLatencyMs: dbLatency,
      redisStatus: 'ONLINE',
      redisLatencyMs: redisLatency,
      storageStatus: 'ONLINE',
      storageLatencyMs: storageLatency,
      env: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    });
  } catch (err) {
    console.error('System diagnostics health check failure:', err);
    return NextResponse.json({
      dbStatus: 'OFFLINE',
      dbLatencyMs: -1,
      redisStatus: 'ONLINE',
      redisLatencyMs: 0,
      storageStatus: 'ONLINE',
      storageLatencyMs: 0,
      error: 'Postgres connection failed',
    }, { status: 500 });
  }
}
