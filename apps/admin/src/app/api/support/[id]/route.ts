import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const ticket = await prisma.supportRequest.findUnique({
      where: { id },
      include: { user: { select: { email: true, profile: true } } },
    });
    if (!ticket) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (err) {
    console.error('Error fetching support ticket detail:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status, priority, category } = await request.json();

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;

    const ticket = await prisma.supportRequest.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    // Notify client of support ticket update
    await prisma.notification.create({
      data: {
        userId: ticket.userId,
        type: 'SUPPORT_REPLY',
        title: `Ticket Status Updated: ${ticket.subject}`,
        message: `Your ticket status has been updated to "${status}".`,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: `SUPPORT_TICKET_${status}`,
        details: { ticketId: id, status },
      },
    });

    return NextResponse.json(ticket);
  } catch (err) {
    console.error('Error updating support ticket:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { reply } = await request.json();

    if (!reply?.trim()) {
      return NextResponse.json({ error: 'Reply content is required.' }, { status: 400 });
    }

    const ticket = await prisma.supportRequest.findUnique({
      where: { id },
    });
    if (!ticket) return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });

    const existingResponse = ticket.response || '';
    const timestamp = new Date().toISOString();
    const newResponse = existingResponse
      ? `${existingResponse}\n---\n[${timestamp}] Analyst: ${reply}`
      : `[${timestamp}] Analyst: ${reply}`;

    const updatedTicket = await prisma.supportRequest.update({
      where: { id },
      data: {
        response: newResponse,
        status: 'IN_PROGRESS', // automatically move to in progress upon analyst reply
      },
    });

    // Notify client of replies
    await prisma.notification.create({
      data: {
        userId: ticket.userId,
        type: 'SUPPORT_REPLY',
        title: `Reply to Ticket: ${ticket.subject}`,
        message: `HawkEdge support has posted a new reply to your ticket: "${reply.substring(0, 40)}..."`,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (err) {
    console.error('Error adding ticket reply:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
