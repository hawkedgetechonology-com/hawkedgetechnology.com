import { Controller, Get, Patch, Body, Request, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto, AdminUpdateUserDto } from './dto/update-profile.dto';
import { AuthRank } from '../auth/decorators';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';

@ApiTags('User Identity & Profiles')
@ApiBearerAuth()
@Controller('user')
@UseInterceptors(AuditLogInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Retrieve active user profile details' })
  async getProfile(@Request() req: { user: { id: string } }) {
    const user = await this.userService.findById(req.user.id);
    const rest = { ...user };
    (rest as { passwordHash?: string | null }).passwordHash = undefined;
    return rest;
  }

  @Patch('profile')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update active user profile details' })
  async updateProfile(@Request() req: { user: { id: string } }, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  @Get('activity')
  @AuthRank('CLIENT', 'STUDENT', 'MENTOR', 'TRAINER', 'HR', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Retrieve active user activity/audit feed logs' })
  async getActivityLogs(@Request() req: { user: { id: string } }) {
    return this.userService.getActivityLogs(req.user.id);
  }

  // Admin Override Routes
  @Patch('admin/update/:id')
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin override: Modify status, rank, or profile configuration' })
  async adminUpdateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.userService.adminUpdateUser(id, dto);
  }

  @Delete('admin/purge/:id')
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin override: Soft delete user record' })
  async softDeleteUser(@Param('id') id: string) {
    return this.userService.softDeleteUser(id);
  }

  @Put('admin/reset-password/:id')
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin override: Hard reset user password key' })
  async resetPassword(@Param('id') id: string, @Body('newPassword') newPasswordPlain: string) {
    return this.userService.resetPassword(id, newPasswordPlain);
  }
}
