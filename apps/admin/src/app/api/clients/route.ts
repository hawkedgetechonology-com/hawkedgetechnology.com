import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const clients = await prisma.user.findMany({
      where: { rank: 'CLIENT' },
      include: {
        profile: true,
        projects: {
          include: {
            milestones: true,
            invoices: true,
          },
        },
        supportRequests: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (err) {
    console.error('Error fetching client list:', err);
    return NextResponse.json({ error: 'Internal Database Error' }, { status: 500 });
  }
}
