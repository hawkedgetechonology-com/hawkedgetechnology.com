import { Controller, Get, Patch, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioNotificationService } from './studio-notification.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Notifications')
@ApiBearerAuth()
@Controller('studio/notifications')
export class StudioNotificationController {
  constructor(private readonly notificationService: StudioNotificationService) {}

  @Get()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: List all notifications' })
  async list(@Request() req: { user: { id: string } }) {
    return this.notificationService.listNotifications(req.user.id);
  }

  @Get('unread-count')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get unread notification count' })
  async unreadCount(@Request() req: { user: { id: string } }) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Mark notification as read' })
  async markRead(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.notificationService.markAsRead(req.user.id, id);
  }

  @Patch('mark-all-read')
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Mark all notifications as read' })
  async markAllRead(@Request() req: { user: { id: string } }) {
    return this.notificationService.markAllRead(req.user.id);
  }
}
