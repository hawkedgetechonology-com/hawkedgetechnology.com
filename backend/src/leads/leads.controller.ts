import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('consultations')
  async createConsultation(@Body() data: Prisma.ConsultationBookingCreateInput) {
    await this.leadsService.createConsultation(data);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('consultations')
  async getConsultations() {
    return this.leadsService.getConsultations();
  }

  @Post('inquiries')
  async createInquiry(@Body() data: Prisma.ProjectInquiryCreateInput) {
    await this.leadsService.createInquiry(data);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('inquiries')
  async getInquiries() {
    return this.leadsService.getInquiries();
  }
}
