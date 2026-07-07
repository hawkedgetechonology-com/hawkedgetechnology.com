import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudioSupportService {
  constructor(private readonly prisma: PrismaService) {}

  async listTickets(userId: string) {
    return this.prisma.supportRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTicket(userId: string, ticketId: string) {
    const ticket = await this.prisma.supportRequest.findFirst({
      where: { id: ticketId, userId },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found.');
    return ticket;
  }

  async createTicket(
    userId: string,
    subject: string,
    message: string,
    priority: string = 'NORMAL',
    category: string = 'GENERAL',
  ) {
    if (!subject?.trim() || !message?.trim()) {
      throw new BadRequestException('Subject and message are required.');
    }

    const ticket = await this.prisma.supportRequest.create({
      data: {
        userId,
        subject,
        message,
        priority,
        category,
        status: 'OPEN',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SUPPORT_TICKET_CREATED',
        details: { ticketId: ticket.id, subject },
      },
    });

    return ticket;
  }

  async addReply(userId: string, ticketId: string, reply: string) {
    const ticket = await this.prisma.supportRequest.findFirst({
      where: { id: ticketId, userId },
    });
    if (!ticket) throw new NotFoundException('Support ticket not found.');

    // Append reply to existing response field
    const existingResponse = ticket.response || '';
    const timestamp = new Date().toISOString();
    const newResponse = existingResponse
      ? `${existingResponse}\n---\n[${timestamp}] Client: ${reply}`
      : `[${timestamp}] Client: ${reply}`;

    return this.prisma.supportRequest.update({
      where: { id: ticketId },
      data: { response: newResponse },
    });
  }
}
