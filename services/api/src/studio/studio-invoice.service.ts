import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudioInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async listInvoices(userId: string) {
    return this.prisma.invoice.findMany({
      where: { project: { clientId: userId } },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoice(userId: string, invoiceId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, project: { clientId: userId } },
      include: { project: { select: { id: true, name: true, client: { select: { profile: true } } } } },
    });
    if (!invoice) throw new NotFoundException('Invoice not found.');
    return invoice;
  }
}
