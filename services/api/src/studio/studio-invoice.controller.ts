import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioInvoiceService } from './studio-invoice.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Invoices')
@ApiBearerAuth()
@Controller('studio/invoices')
export class StudioInvoiceController {
  constructor(private readonly invoiceService: StudioInvoiceService) {}

  @Get()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List all invoices' })
  async listInvoices(@Request() req: { user: { id: string } }) {
    return this.invoiceService.listInvoices(req.user.id);
  }

  @Get(':id')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get invoice details' })
  async getInvoice(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.invoiceService.getInvoice(req.user.id, id);
  }
}
