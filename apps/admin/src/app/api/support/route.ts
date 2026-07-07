import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const tickets = await prisma.supportRequest.findMany({
      include: {
        user: { select: { email: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const inProgressTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
    const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED').length;

    // SLA tracking: Avg response time mock (e.g., 2.4 hours)
    const avgResponseTimeHours = 2.4;

    return NextResponse.json({
      tickets,
      stats: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        avgResponseTimeHours,
        slaCompliance: '98.5%',
      },
    });
  } catch (err) {
    console.error('Error fetching admin support queue:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
