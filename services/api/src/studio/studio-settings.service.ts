import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudioSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    if (user.passwordHash) {
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) throw new BadRequestException('Current password is incorrect.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, loginAttempts: 0, lockUntil: null },
    });

    return { success: true, message: 'Password updated successfully.' };
  }

  async listSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false },
      select: {
        id: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found.');

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    return { success: true, message: 'Session revoked.' };
  }

  async getSecurityOverview(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        mfaEnabled: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          where: { isRevoked: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true, ipAddress: true, userAgent: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found.');

    return {
      mfaEnabled: user.mfaEnabled,
      accountCreated: user.createdAt,
      lastLogin: user.sessions[0]?.createdAt || null,
      lastLoginIp: user.sessions[0]?.ipAddress || null,
      activeSessions: await this.prisma.session.count({
        where: { userId, isRevoked: false },
      }),
    };
  }
}
