import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: true,
        versions: { orderBy: { version: 'desc' }, take: 1 },
        revisions: { orderBy: { createdAt: 'desc' } },
        quotations: { include: { items: true } },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });
    }

    const currentVersion = proposal.versions[0];

    return NextResponse.json({
      ...proposal,
      sections: currentVersion ? currentVersion.sections : {},
    });
  } catch (err) {
    console.error('Proposal fetch error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
