import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { comments } = await request.json();
    if (!comments?.trim()) return NextResponse.json({ error: 'Revision comments are required.' }, { status: 400 });

    const proposal = await prisma.proposal.findUnique({ where: { id }, include: { lead: true } });
    if (!proposal) return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });

    // Log the revision request
    const revision = await prisma.proposalRevision.create({
      data: { proposalId: id, comments, status: 'PENDING' },
    });

    // Revert proposal status and update lead stage
    await prisma.proposal.update({ where: { id }, data: { status: 'REJECTED' } });
    await prisma.lead.update({ where: { id: proposal.leadId }, data: { status: 'CONTACTED' } });

    await prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_REVISION_REQUESTED',
        details: { proposalId: id, comments, leadId: proposal.leadId },
      },
    });

    return NextResponse.json(revision);
  } catch (err) {
    console.error('Proposal revision error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
