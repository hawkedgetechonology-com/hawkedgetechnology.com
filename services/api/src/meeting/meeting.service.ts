import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { NotificationService } from '@hawkedge/notifications';

@Injectable()
export class MeetingService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly notification = new NotificationService();

  async getAvailableSlots(dateString: string) {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      throw new ConflictException('Invalid date query format parameter.');
    }

    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth();
    const day = dateObj.getUTCDate();

    // 1. Business Days Check: Monday - Friday (1 - 5)
    const dayOfWeek = dateObj.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return []; // Weekends are closed
    }

    // 2. Generate 30-min time slots between 09:00 and 17:00 UTC
    const slots: Date[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (const minute of [0, 30]) {
        slots.push(new Date(Date.UTC(year, month, day, hour, minute)));
      }
    }

    // 3. Fetch scheduled non-cancelled meetings for target day
    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59));

    const bookedMeetings = await this.prisma.meeting.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    // Filter out booked slots
    const bookedTimes = bookedMeetings.map((m) => m.scheduledAt.getTime());
    return slots
      .filter((s) => !bookedTimes.includes(s.getTime()))
      .map((s) => s.toISOString());
  }

  async createBooking(dto: CreateMeetingDto) {
    const scheduledTime = new Date(dto.scheduledAt);

    // 1. Fetch Lead
    const lead = await this.prisma.lead.findFirst({
      where: { id: dto.leadId, isDeleted: false },
    });
    if (!lead) {
      throw new NotFoundException('Target lead identity not found.');
    }

    // 2. Transaction safety to prevent double-booking
    return this.prisma.$transaction(async (tx) => {
      const conflict = await tx.meeting.findFirst({
        where: {
          scheduledAt: scheduledTime,
          status: {
            not: 'CANCELLED',
          },
        },
      });

      if (conflict) {
        throw new ConflictException('Requested time slot has already been booked.');
      }

      const meeting = await tx.meeting.create({
        data: {
          leadId: dto.leadId,
          title: dto.title,
          purpose: dto.purpose,
          notes: dto.notes,
          scheduledAt: scheduledTime,
          durationMinutes: dto.durationMinutes || 30,
          status: 'SCHEDULED',
        },
      });

      // Update lead pipeline stage to CONSULTATION_SCHEDULED
      await tx.lead.update({
        where: { id: dto.leadId },
        data: { status: 'CONSULTATION_SCHEDULED' },
      });

      // Dispatch Notifications
      await this.notification.sendNotification(['EMAIL'], {
        recipient: lead.email,
        subject: 'HawkEdge Consultation Booked',
        body: `Hello ${lead.fullName}, your consultation has been successfully scheduled for ${meeting.scheduledAt.toUTCString()}. Purpose: ${meeting.purpose || 'Discovery review'}.`,
      });

      await this.notification.sendNotification(['EMAIL'], {
        recipient: 'admin@hawkedge.tech',
        subject: `New Meeting Booked: ${lead.fullName}`,
        body: `Consultation meeting scheduled for ${lead.companyName} on ${meeting.scheduledAt.toUTCString()}.`,
      });

      // Write Audit Log
      await tx.auditLog.create({
        data: {
          action: 'MEETING_SCHEDULED',
          details: {
            meetingId: meeting.id,
            leadId: dto.leadId,
            scheduledAt: dto.scheduledAt,
          },
        },
      });

      return meeting;
    });
  }

  async listBookings(leadId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (leadId) {
      where.leadId = leadId;
    }
    return this.prisma.meeting.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      include: {
        lead: true,
      },
    });
  }

  async findById(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!meeting) {
      throw new NotFoundException('Meeting record not found.');
    }
    return meeting;
  }

  async updateBooking(id: string, dto: UpdateMeetingDto, userId?: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!meeting) {
      throw new NotFoundException('Meeting record not found.');
    }

    const oldStatus = meeting.status;
    const oldSchedule = meeting.scheduledAt.getTime();

    // Check conflict if rescheduling time
    if (dto.scheduledAt) {
      const newSchedule = new Date(dto.scheduledAt);
      if (newSchedule.getTime() !== oldSchedule) {
        const conflict = await this.prisma.meeting.findFirst({
          where: {
            id: { not: id },
            scheduledAt: newSchedule,
            status: { not: 'CANCELLED' },
          },
        });
        if (conflict) {
          throw new ConflictException('New scheduled slot is already occupied.');
        }
      }
    }

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: {
        title: dto.title,
        purpose: dto.purpose,
        notes: dto.notes,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        durationMinutes: dto.durationMinutes,
        status: dto.status,
      },
    });

    // Audit and notify on status change
    if (dto.status && dto.status !== oldStatus) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'MEETING_STATUS_UPDATED',
          details: {
            meetingId: id,
            oldStatus,
            newStatus: dto.status,
          },
        },
      });

      await this.notification.sendNotification(['EMAIL'], {
        recipient: meeting.lead.email,
        subject: `Consultation Meeting Status: ${dto.status}`,
        body: `Hello ${meeting.lead.fullName}, your consultation meeting status is now ${dto.status}.`,
      });
    }

    // Audit and notify on rescheduling
    if (dto.scheduledAt && new Date(dto.scheduledAt).getTime() !== oldSchedule) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'MEETING_RESCHEDULED',
          details: {
            meetingId: id,
            oldSchedule: new Date(oldSchedule).toISOString(),
            newSchedule: dto.scheduledAt,
          },
        },
      });

      await this.notification.sendNotification(['EMAIL'], {
        recipient: meeting.lead.email,
        subject: 'Consultation Meeting Rescheduled',
        body: `Hello ${meeting.lead.fullName}, your consultation meeting has been rescheduled to ${new Date(dto.scheduledAt).toUTCString()}.`,
      });
    }

    return updated;
  }

  async cancelBooking(id: string, userId?: string) {
    return this.updateBooking(id, { status: 'CANCELLED' }, userId);
  }
}
