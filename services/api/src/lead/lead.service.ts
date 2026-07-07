import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@hawkedge/database';
import { NotificationService } from '@hawkedge/notifications';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly notification = new NotificationService();

  async createLead(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        fullName: dto.fullName,
        companyName: dto.companyName,
        email: dto.email,
        buildType: dto.buildType,
        leadScore: dto.leadScore,
        leadPriority: dto.leadPriority,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawAnswers: dto.rawAnswers as any,
        status: 'NEW',
      },
    });

    // Generate notification for new lead
    await this.notification.sendNotification(['EMAIL'], {
      recipient: 'admin@hawkedge.tech',
      subject: `New Lead Arrived: ${lead.fullName} (${lead.companyName})`,
      body: `A new consultation diagnostic lead has completed the discovery flow. Score: ${lead.leadScore}. Priority: ${lead.leadPriority}.`,
    });

    // Create system audit log
    await this.prisma.auditLog.create({
      data: {
        action: 'LEAD_CREATED',
        details: {
          leadId: lead.id,
          fullName: lead.fullName,
          companyName: lead.companyName,
        },
      },
    });

    return lead;
  }

  async listLeads(query: {
    search?: string;
    status?: LeadStatus;
    priority?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isDeleted: false };

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.leadPriority = query.priority;
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';

    return this.prisma.lead.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        meetings: true,
        quotations: true,
      },
    });
  }

  async findById(id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isDeleted: false },
      include: {
        meetings: true,
        quotations: true,
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead record not found in the system ledger.');
    }

    // Fetch activity log (Audit logs related to this lead)
    const logs = await this.prisma.auditLog.findMany({
      where: {
        OR: [
          { details: { path: ['leadId'], equals: id } },
          { details: { path: ['id'], equals: id } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      ...lead,
      activityHistory: logs.map(l => ({
        id: l.id,
        action: l.action,
        timestamp: l.createdAt,
        operatorId: l.userId,
        details: l.details,
      })),
    };
  }

  async updateLead(id: string, dto: UpdateLeadDto, userId?: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isDeleted: false },
    });

    if (!lead) {
      throw new NotFoundException('Lead record not found.');
    }

    const oldStatus = lead.status;
    const oldAssignee = lead.assignedTo;

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        companyName: dto.companyName,
        email: dto.email,
        buildType: dto.buildType,
        leadScore: dto.leadScore,
        leadPriority: dto.leadPriority,
        status: dto.status,
        assignedTo: dto.assignedTo,
        internalNotes: dto.internalNotes,
      },
    });

    // Audit & Notification logic for Status updates
    if (dto.status && dto.status !== oldStatus) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'LEAD_STATUS_UPDATED',
          details: {
            leadId: id,
            oldStatus,
            newStatus: dto.status,
          },
        },
      });

      await this.notification.sendNotification(['EMAIL'], {
        recipient: lead.email,
        subject: `HawkEdge Consultation Pipeline Update`,
        body: `Hello ${lead.fullName}, your consultation project status has changed from ${oldStatus} to ${dto.status}.`,
      });
    }

    // Audit & Notification logic for Owner assignments
    if (dto.assignedTo && dto.assignedTo !== oldAssignee) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'LEAD_ASSIGNED',
          details: {
            leadId: id,
            oldAssignee,
            newAssignee: dto.assignedTo,
          },
        },
      });

      await this.notification.sendNotification(['EMAIL'], {
        recipient: 'admin@hawkedge.tech',
        subject: `Lead Assigned: ${lead.fullName}`,
        body: `Consultation lead for ${lead.companyName} has been assigned to owner: ${dto.assignedTo}.`,
      });
    }

    return updated;
  }

  async addNote(id: string, note: string, userId?: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isDeleted: false },
    });

    if (!lead) {
      throw new NotFoundException('Lead record not found.');
    }

    const timestamp = new Date().toISOString();
    const updatedNotes = lead.internalNotes
      ? `${lead.internalNotes}\n\n[${timestamp}]: ${note}`
      : `[${timestamp}]: ${note}`;

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { internalNotes: updatedNotes },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'LEAD_NOTE_ADDED',
        details: {
          leadId: id,
          noteSnippet: note.length > 50 ? `${note.slice(0, 50)}...` : note,
        },
      },
    });

    return updated;
  }

  async softDelete(id: string, userId?: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isDeleted: false },
    });

    if (!lead) {
      throw new NotFoundException('Lead record not found.');
    }

    const deleted = await this.prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'LEAD_DELETED',
        details: {
          leadId: id,
          fullName: lead.fullName,
        },
      },
    });

    return deleted;
  }
}
