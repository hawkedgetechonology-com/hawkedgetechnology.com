import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudioDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [user, projects, invoices, supportRequests, notifications, auditLogs] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        }),
        this.prisma.project.findMany({
          where: { clientId: userId },
          include: {
            milestones: { orderBy: { createdAt: 'asc' } },
            invoices: true,
          },
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.invoice.findMany({
          where: { project: { clientId: userId } },
          include: { project: { select: { name: true } } },
          orderBy: { dueDate: 'asc' },
        }),
        this.prisma.supportRequest.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        this.prisma.notification.findMany({
          where: { userId, isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        this.prisma.auditLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    // Compute aggregates
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (p) => p.status === 'IN_PROGRESS' || p.status === 'REVIEW',
    ).length;

    const allMilestones = projects.flatMap((p) => p.milestones);
    const activeMilestones = allMilestones
      .filter((m) => m.status === 'IN_PROGRESS' || m.status === 'CLIENT_REVIEW')
      .slice(0, 5);

    const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
    const totalPaid = invoices
      .filter((i) => i.status === 'PAID')
      .reduce((s, i) => s + i.amount, 0);
    const outstanding = totalInvoiced - totalPaid;

    const nextDueInvoice = invoices.find((i) => i.status === 'UNPAID' || i.status === 'OVERDUE');
    const openTickets = supportRequests.filter((s) => s.status !== 'RESOLVED').length;

    return {
      user: {
        firstName: user?.profile?.firstName || 'Client',
        lastName: user?.profile?.lastName || '',
        companyName: user?.profile?.companyName || '',
        email: user?.email || '',
      },
      stats: {
        totalProjects,
        activeProjects,
        totalInvoiced,
        totalPaid,
        outstanding,
        openTickets,
        unreadNotifications: notifications.length,
      },
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        progress: p.milestones.length > 0
          ? Math.round(
              (p.milestones.filter((m) => m.status === 'COMPLETED').length /
                p.milestones.length) *
                100,
            )
          : 0,
        startDate: p.startDate,
        endDate: p.endDate,
        milestonesTotal: p.milestones.length,
        milestonesCompleted: p.milestones.filter((m) => m.status === 'COMPLETED').length,
      })),
      activeMilestones: activeMilestones.map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        owner: m.owner,
        dateLabel: m.dateLabel,
        completion: m.completion,
      })),
      nextDueInvoice: nextDueInvoice
        ? {
            id: nextDueInvoice.id,
            invoiceNumber: nextDueInvoice.invoiceNumber,
            amount: nextDueInvoice.amount,
            dueDate: nextDueInvoice.dueDate,
            status: nextDueInvoice.status,
          }
        : null,
      recentActivity: auditLogs.map((a) => ({
        id: a.id,
        action: a.action,
        details: a.details,
        createdAt: a.createdAt,
      })),
      recentTickets: supportRequests.slice(0, 3).map((s) => ({
        id: s.id,
        subject: s.subject,
        status: s.status,
        priority: s.priority,
        createdAt: s.createdAt,
      })),
    };
  }
}
