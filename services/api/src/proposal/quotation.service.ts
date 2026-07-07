import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationService } from '@hawkedge/notifications';
import { QuotationStatus } from '@hawkedge/database';

interface QuotationItemInput {
  description: string;
  quantity: number;
  rate: number;
}

@Injectable()
export class QuotationService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly notification = new NotificationService();

  private generateQuotationNumber(): string {
    const year = new Date().getFullYear();
    const seq = Math.floor(1000 + Math.random() * 9000);
    return `Q-${year}-${seq}`;
  }

  private computeTotal(items: QuotationItemInput[], taxRate: number, discount: number): number {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const tax = subtotal * taxRate;
    return subtotal + tax - discount;
  }

  async createQuotation(
    leadId: string,
    proposalId: string | null,
    currency: string,
    taxRate: number,
    discount: number,
    validUntil: Date,
    paymentTerms: string,
    items: QuotationItemInput[],
  ) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found.');
    if (items.length === 0) throw new BadRequestException('At least one line item is required.');

    const totalAmount = this.computeTotal(items, taxRate, discount);

    const quotation = await this.prisma.quotation.create({
      data: {
        quotationNumber: this.generateQuotationNumber(),
        leadId,
        proposalId: proposalId ?? undefined,
        currency,
        taxRate,
        discount,
        totalAmount,
        validUntil,
        paymentTerms,
        status: 'DRAFT',
        items: {
          create: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: { items: true, lead: true },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'QUOTATION_CREATED',
        details: {
          quotationId: quotation.id,
          quotationNumber: quotation.quotationNumber,
          leadId,
          totalAmount,
        },
      },
    });

    return quotation;
  }

  async listQuotations(leadId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (leadId) where.leadId = leadId;

    return this.prisma.quotation.findMany({
      where,
      include: { items: true, lead: true, proposal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getQuotation(id: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: { items: true, lead: true, proposal: true },
    });
    if (!quotation) throw new NotFoundException('Quotation not found.');
    return quotation;
  }

  async updateQuotation(
    id: string,
    updates: {
      currency?: string;
      taxRate?: number;
      discount?: number;
      validUntil?: Date;
      paymentTerms?: string;
      items?: QuotationItemInput[];
    },
  ) {
    const existing = await this.prisma.quotation.findUnique({ where: { id }, include: { items: true } });
    if (!existing) throw new NotFoundException('Quotation not found.');

    let totalAmount = existing.totalAmount;

    // If items are being replaced, delete old and recompute total
    if (updates.items) {
      await this.prisma.quotationItem.deleteMany({ where: { quotationId: id } });
      totalAmount = this.computeTotal(
        updates.items,
        updates.taxRate ?? existing.taxRate,
        updates.discount ?? existing.discount,
      );
    }

    return this.prisma.quotation.update({
      where: { id },
      data: {
        currency: updates.currency,
        taxRate: updates.taxRate,
        discount: updates.discount,
        validUntil: updates.validUntil,
        paymentTerms: updates.paymentTerms,
        totalAmount,
        items: updates.items
          ? {
              create: updates.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.quantity * item.rate,
              })),
            }
          : undefined,
      },
      include: { items: true, lead: true },
    });
  }

  async updateStatus(id: string, status: QuotationStatus) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!quotation) throw new NotFoundException('Quotation not found.');

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status },
    });

    if (status === 'SENT') {
      await this.notification.sendNotification(['EMAIL'], {
        recipient: quotation.lead.email,
        subject: `Quotation ${quotation.quotationNumber} Issued by HawkEdge`,
        body: `Your commercial quotation of ${quotation.currency} ${quotation.totalAmount.toLocaleString()} is ready. Valid until ${new Date(quotation.validUntil).toLocaleDateString()}.`,
      });
    }

    await this.prisma.auditLog.create({
      data: {
        action: 'QUOTATION_STATUS_UPDATED',
        details: { quotationId: id, status },
      },
    });

    return updated;
  }

  async deleteQuotation(id: string) {
    const existing = await this.prisma.quotation.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Quotation not found.');
    return this.prisma.quotation.delete({ where: { id } });
  }
}
