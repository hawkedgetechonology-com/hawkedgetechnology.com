import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class StudioProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found.');

    return {
      id: user.id,
      email: user.email,
      rank: user.rank,
      status: user.status,
      mfaEnabled: user.mfaEnabled,
      profile: user.profile,
    };
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName?: string;
    companyWebsite?: string;
    companyGst?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    notificationSettings?: Record<string, boolean>;
  }) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found.');

    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }
}
