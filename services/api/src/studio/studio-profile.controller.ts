import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudioProfileService } from './studio-profile.service';
import { AuthRank } from '../auth/decorators';

@ApiTags('Studio — Profile')
@ApiBearerAuth()
@Controller('studio/profile')
export class StudioProfileController {
  constructor(private readonly profileService: StudioProfileService) {}

  @Get()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Get profile details' })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch()
  @AuthRank('CLIENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Client: Update profile details' })
  async updateProfile(
    @Request() req: { user: { id: string } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() data: any,
  ) {
    return this.profileService.updateProfile(req.user.id, data);
  }
}
