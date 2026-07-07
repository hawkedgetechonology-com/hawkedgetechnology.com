import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioDashboardService } from './studio-dashboard.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Client Workspace')
@ApiBearerAuth()
@Controller('studio')
export class StudioDashboardController {
  constructor(private readonly dashboardService: StudioDashboardService) {}

  @Get('dashboard')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get aggregated workspace dashboard data' })
  async getDashboard(@Request() req: { user: { id: string } }) {
    return this.dashboardService.getDashboard(req.user.id);
  }
}
