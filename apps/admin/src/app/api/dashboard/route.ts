import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const [
      leadsPipeline,
      clientsCount,
      projectsCount,
      pendingInvoices,
      meetingsCount,
      openTicketsCount,
      paidInvoices
    ] = await Promise.all([
      prisma.lead.findMany({ where: { isDeleted: false, status: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } } }),
      prisma.user.count({ where: { rank: 'CLIENT' } }),
      prisma.project.count(),
      prisma.invoice.findMany({ where: { status: { not: 'PAID' } }, select: { amount: true } }),
      prisma.meeting.count({ where: { scheduledAt: { gte: new Date() } } }),
      prisma.supportRequest.count({ where: { status: { not: 'RESOLVED' } } }),
      prisma.invoice.findMany({ where: { status: 'PAID' }, select: { amount: true } }),
    ]);

    // Compute metrics
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingFinance = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Simulated pipeline value ($50k per active lead)
    const pipelineValue = leadsPipeline.length * 45000;

    return NextResponse.json({
      revenue: totalRevenue,
      pipelineValue,
      activeClients: clientsCount,
      activeProjects: projectsCount,
      pendingInvoicesCount: pendingInvoices.length,
      pendingInvoicesAmount: pendingFinance,
      upcomingMeetings: meetingsCount,
      supportQueueSize: openTicketsCount,
      systemHealth: '100% ONLINE',
    });
  } catch (err) {
    console.error('Error fetching admin dashboard metrics:', err);
    return NextResponse.json({ error: 'Internal database query failed.' }, { status: 500 });
  }
}
