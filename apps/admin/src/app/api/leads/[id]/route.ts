import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { status, assignedTo, note } = body;

    const lead = await prisma.lead.findFirst({
      where: { id, isDeleted: false },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditLogs: any[] = [];

    if (status && status !== lead.status) {
      updateData.status = status;
      auditLogs.push({
        action: 'LEAD_STATUS_UPDATED',
        details: {
          leadId: id,
          oldStatus: lead.status,
          newStatus: status,
        },
      });
    }

    if (assignedTo !== undefined && assignedTo !== lead.assignedTo) {
      updateData.assignedTo = assignedTo;
      auditLogs.push({
        action: 'LEAD_ASSIGNED',
        details: {
          leadId: id,
          oldAssignee: lead.assignedTo,
          newAssignee: assignedTo,
        },
      });
    }

    if (note) {
      const timestamp = new Date().toISOString();
      updateData.internalNotes = lead.internalNotes
        ? `${lead.internalNotes}\n\n[${timestamp}]: ${note}`
        : `[${timestamp}]: ${note}`;

      auditLogs.push({
        action: 'LEAD_NOTE_ADDED',
        details: {
          leadId: id,
          noteSnippet: note.length > 50 ? `${note.slice(0, 50)}...` : note,
        },
      });
    }

    // Perform database updates
    const updatedLead = await prisma.lead.update({
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

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (e) {
    console.error('Failed to update lead', e);
    return NextResponse.json({ error: 'Transaction failed.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const lead = await prisma.lead.findFirst({
      where: { id, isDeleted: false },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    await prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'LEAD_DELETED',
        details: {
          leadId: id,
          fullName: lead.fullName,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Failed to delete lead', e);
    return NextResponse.json({ error: 'Transaction failed.' }, { status: 500 });
  }
}
