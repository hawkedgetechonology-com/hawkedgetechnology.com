import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { status, scheduledAt } = body;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditLogs: any[] = [];

    if (status && status !== meeting.status) {
      updateData.status = status;
      auditLogs.push({
        action: 'MEETING_STATUS_UPDATED',
        details: {
          meetingId: id,
          oldStatus: meeting.status,
          newStatus: status,
        },
      });
    }

    if (scheduledAt) {
      const newSchedule = new Date(scheduledAt);
      if (!isNaN(newSchedule.getTime()) && newSchedule.getTime() !== meeting.scheduledAt.getTime()) {
        updateData.scheduledAt = newSchedule;
        auditLogs.push({
          action: 'MEETING_RESCHEDULED',
          details: {
            meetingId: id,
            oldSchedule: meeting.scheduledAt.toISOString(),
            newSchedule: scheduledAt,
          },
        });
      }
    }

    const updated = await prisma.meeting.update({
      where: { id },
      data: updateData,
    });

    // Write audit logs
    for (const log of auditLogs) {
      await prisma.auditLog.create({
        data: {
          action: log.action,
          details: log.details,
        },
      });
    }

    return NextResponse.json({ success: true, meeting: updated });
  } catch (e) {
    console.error('Failed to update meeting', e);
    return NextResponse.json({ error: 'Transaction failed.' }, { status: 500 });
  }
}
