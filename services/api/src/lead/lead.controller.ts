import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@hawkedge/database';
import { AuthRank } from '../auth/decorators';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';

@ApiTags('CRM Lead Management')
@Controller('leads')
@UseInterceptors(AuditLogInterceptor)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new consultation discovery lead (Public)' })
  async createLead(@Body() dto: CreateLeadDto) {
    return this.leadService.createLead(dto);
  }

  @Get()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Retrieve list of leads with filters & search' })
  async listLeads(
    @Query('search') search?: string,
    @Query('status') status?: LeadStatus,
    @Query('priority') priority?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.leadService.listLeads({ search, status, priority, sortBy, order });
  }

  @Get(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Get full lead profile including meetings and audit feed' })
  async getLeadDetails(@Param('id') id: string) {
    return this.leadService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Modify general lead configurations' })
  async updateLead(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @Request() req: { user?: { id: string } },
  ) {
    return this.leadService.updateLead(id, dto, req.user?.id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Update lead pipeline lifecycle stage' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
    @Request() req: { user?: { id: string } },
  ) {
    return this.leadService.updateLead(id, { status }, req.user?.id);
  }

  @Patch(':id/assign')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Assign ownership of a consultation lead' })
  async assignLead(
    @Param('id') id: string,
    @Body('assignedTo') assignedTo: string,
    @Request() req: { user?: { id: string } },
  ) {
    return this.leadService.updateLead(id, { assignedTo }, req.user?.id);
  }

  @Post(':id/notes')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Append a internal coordination note' })
  async addNote(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req: { user?: { id: string } },
  ) {
    return this.leadService.addNote(id, note, req.user?.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Soft delete lead record' })
  async softDelete(@Param('id') id: string, @Request() req: { user?: { id: string } }) {
    return this.leadService.softDelete(id, req.user?.id);
  }
}
