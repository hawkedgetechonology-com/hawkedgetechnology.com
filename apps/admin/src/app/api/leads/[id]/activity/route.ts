import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const logs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { details: { path: ['leadId'], equals: id } },
          { details: { path: ['id'], equals: id } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      activity: logs.map((l) => ({
        id: l.id,
        action: l.action,
        timestamp: l.createdAt.toISOString(),
        details: l.details,
      })),
    });
  } catch (e) {
    console.error('Failed to get lead activity logs', e);
    return NextResponse.json({ error: 'Failed to retrieve activity feed.' }, { status: 500 });
  }
}
