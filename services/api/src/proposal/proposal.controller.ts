import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalService } from './proposal.service';
import { AuthRank } from '../auth/decorators';
import { ProposalStatus } from '@hawkedge/database';

@ApiTags('Proposal & Quotation Management')
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('templates')
  @ApiOperation({ summary: 'Admin: Retrieve list of proposal templates' })
  async listTemplates() {
    return this.proposalService.listTemplates();
  }

  @Post()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Compile new proposal from category template' })
  async createProposal(
    @Body('leadId') leadId: string,
    @Body('title') title: string,
    @Body('serviceCategory') serviceCategory: string,
  ) {
    return this.proposalService.createProposal(leadId, title, serviceCategory);
  }

  @Get()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Retrieve list of proposals' })
  async listProposals(@Query('leadId') leadId?: string) {
    return this.proposalService.listProposals(leadId);
  }

  @Get('metrics')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: View proposal acceptance metrics' })
  async getMetrics() {
    return this.proposalService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Public/Client: Retrieve details of a proposal for portal viewing' })
  async getProposal(@Param('id') id: string) {
    return this.proposalService.getProposal(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Edit details / save draft version' })
  async updateProposal(
    @Param('id') id: string,
    @Body('title') title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body('sections') sections: any,
  ) {
    return this.proposalService.updateProposal(id, title, sections);
  }

  @Post(':id/duplicate')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Duplicate proposal' })
  async duplicateProposal(@Param('id') id: string) {
    return this.proposalService.duplicateProposal(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Public/Client: Accept or change proposal status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProposalStatus,
  ) {
    return this.proposalService.updateStatus(id, status);
  }

  @Post(':id/revise')
  @ApiOperation({ summary: 'Public/Client: Request revision from portal' })
  async requestRevision(
    @Param('id') id: string,
    @Body('comments') comments: string,
  ) {
    return this.proposalService.requestRevision(id, comments);
  }
}
