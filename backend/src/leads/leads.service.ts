import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async createConsultation(data: Prisma.ConsultationBookingCreateInput) {
    return this.prisma.consultationBooking.create({ data });
  }

  async getConsultations() {
    return this.prisma.consultationBooking.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInquiry(data: Prisma.ProjectInquiryCreateInput) {
    return this.prisma.projectInquiry.create({ data });
  }

  async getInquiries() {
    return this.prisma.projectInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
