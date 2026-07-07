import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioSettingsService } from './studio-settings.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Settings')
@ApiBearerAuth()
@Controller('studio/settings')
export class StudioSettingsController {
  constructor(private readonly settingsService: StudioSettingsService) {}

  @Post('change-password')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Change password' })
  async changePassword(
    @Request() req: { user: { id: string } },
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.settingsService.changePassword(req.user.id, currentPassword, newPassword);
  }

  @Get('sessions')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List active sessions' })
  async listSessions(@Request() req: { user: { id: string } }) {
    return this.settingsService.listSessions(req.user.id);
  }

  @Post('sessions/:id/revoke')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Revoke a session' })
  async revokeSession(
    @Request() req: { user: { id: string } },
    @Param('id') sessionId: string,
  ) {
    return this.settingsService.revokeSession(req.user.id, sessionId);
  }

  @Get('security')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get security overview' })
  async getSecurityOverview(@Request() req: { user: { id: string } }) {
    return this.settingsService.getSecurityOverview(req.user.id);
  }
}
