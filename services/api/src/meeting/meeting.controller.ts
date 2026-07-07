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
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AuthRank } from '../auth/decorators';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';

@ApiTags('Consultation Booking Scheduler')
@Controller('meetings')
@UseInterceptors(AuditLogInterceptor)
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get('available-slots')
  @ApiOperation({ summary: 'Public: Query available consultation time slots for a specific date' })
  async getAvailableSlots(@Query('date') dateString: string) {
    return this.meetingService.getAvailableSlots(dateString);
  }

  @Post()
  @ApiOperation({ summary: 'Public: Book a consultation slot linking to an active lead' })
  async createBooking(@Body() dto: CreateMeetingDto) {
    return this.meetingService.createBooking(dto);
  }

  @Get()
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: List all scheduled consultation meetings' })
  async listBookings(@Query('leadId') leadId?: string) {
    return this.meetingService.listBookings(leadId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin: Get details of a single meeting' })
  async getMeetingDetails(@Param('id') id: string) {
    return this.meetingService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin/Staff: Reschedule meeting dates or update status' })
  async updateBooking(
    @Param('id') id: string,
    @Body() dto: UpdateMeetingDto,
    @Request() req: { user?: { id: string } },
  ) {
    return this.meetingService.updateBooking(id, dto, req.user?.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @AuthRank('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin/Staff: Cancel scheduled meeting' })
  async cancelBooking(@Param('id') id: string, @Request() req: { user?: { id: string } }) {
    return this.meetingService.cancelBooking(id, req.user?.id);
  }
}
