import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, title, purpose, notes, scheduledAt, durationMinutes } = body;

    if (!leadId || !title || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required meeting details coordinates.' }, { status: 400 });
    }

    const scheduledTime = new Date(scheduledAt);
    if (isNaN(scheduledTime.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt format.' }, { status: 400 });
    }

    // 1. Fetch Lead
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, isDeleted: false },
    });
    if (!lead) {
      return NextResponse.json({ error: 'Lead profile coordinates not found.' }, { status: 404 });
    }

    // 2. Transaction database write
    const result = await prisma.$transaction(async (tx) => {
      const conflict = await tx.meeting.findFirst({
        where: {
          scheduledAt: scheduledTime,
          status: {
            not: 'CANCELLED',
          },
        },
      });

      if (conflict) {
        throw new Error('SLOT_OCCUPIED');
      }

      const meeting = await tx.meeting.create({
        data: {
          leadId,
          title,
          purpose,
          notes,
          scheduledAt: scheduledTime,
          durationMinutes: durationMinutes || 30,
          status: 'SCHEDULED',
        },
      });

      // Update Lead status to CONSULTATION_SCHEDULED
      await tx.lead.update({
        where: { id: leadId },
        data: { status: 'CONSULTATION_SCHEDULED' },
      });

      // Write Audit log
      await tx.auditLog.create({
        data: {
          action: 'MEETING_SCHEDULED',
          details: {
            meetingId: meeting.id,
            leadId,
            scheduledAt,
          },
        },
      });

      return meeting;
    });

    return NextResponse.json({ success: true, meeting: result });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'SLOT_OCCUPIED') {
      return NextResponse.json({ error: 'The requested time slot is no longer available.' }, { status: 409 });
    }
    console.error('Failed to create consultation meeting', e);
    return NextResponse.json({ error: 'Database transaction lock error.' }, { status: 500 });
  }
}
