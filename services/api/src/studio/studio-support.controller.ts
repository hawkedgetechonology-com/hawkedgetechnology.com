import { Controller, Get, Post, Param, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioSupportService } from './studio-support.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Support')
@ApiBearerAuth()
@Controller('studio/support')
export class StudioSupportController {
  constructor(private readonly supportService: StudioSupportService) {}

  @Get()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List all support tickets' })
  async listTickets(@Request() req: { user: { id: string } }) {
    return this.supportService.listTickets(req.user.id);
  }

  @Get(':id')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get support ticket details' })
  async getTicket(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.supportService.getTicket(req.user.id, id);
  }

  @Post()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Create new support ticket' })
  async createTicket(
    @Request() req: { user: { id: string } },
    @Body('subject') subject: string,
    @Body('message') message: string,
    @Body('priority') priority: string,
    @Body('category') category: string,
  ) {
    return this.supportService.createTicket(req.user.id, subject, message, priority, category);
  }

  @Post(':id/reply')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Add reply to support ticket' })
  async addReply(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body('reply') reply: string,
  ) {
    return this.supportService.addReply(req.user.id, id, reply);
  }
}
