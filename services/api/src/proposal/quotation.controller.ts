import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuotationService } from './quotation.service';
import { AuthRank } from '../auth/decorators';
import { QuotationStatus } from '@hawkedge/database';

@ApiTags('Quotation Management')
@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Create a new quotation with line items' })
  async createQuotation(
    @Body('leadId') leadId: string,
    @Body('proposalId') proposalId: string,
    @Body('currency') currency: string,
    @Body('taxRate') taxRate: number,
    @Body('discount') discount: number,
    @Body('validUntil') validUntil: string,
    @Body('paymentTerms') paymentTerms: string,
    @Body('items') items: { description: string; quantity: number; rate: number }[],
  ) {
    return this.quotationService.createQuotation(
      leadId,
      proposalId ?? null,
      currency ?? 'USD',
      taxRate ?? 0,
      discount ?? 0,
      new Date(validUntil),
      paymentTerms ?? 'Net 30',
      items ?? [],
    );
  }

  @Get()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: List all quotations' })
  async listQuotations(@Query('leadId') leadId?: string) {
    return this.quotationService.listQuotations(leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Public/Client: Get quotation details' })
  async getQuotation(@Param('id') id: string) {
    return this.quotationService.getQuotation(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Update quotation details and line items' })
  async updateQuotation(
    @Param('id') id: string,
    @Body() updates: {
      currency?: string;
      taxRate?: number;
      discount?: number;
      validUntil?: string;
      paymentTerms?: string;
      items?: { description: string; quantity: number; rate: number }[];
    },
  ) {
    return this.quotationService.updateQuotation(id, {
      ...updates,
      validUntil: updates.validUntil ? new Date(updates.validUntil) : undefined,
    });
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Update quotation status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: QuotationStatus,
  ) {
    return this.quotationService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Delete a quotation' })
  async deleteQuotation(@Param('id') id: string) {
    return this.quotationService.deleteQuotation(id);
  }
}
