import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto, AdminUpdateUserDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User identity not found in the system ledger.');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Find or create profile record
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...dto };

    if (!profile) {
      return this.prisma.profile.create({
        data: {
          userId,
          firstName: dto.firstName || 'First',
          lastName: dto.lastName || 'Last',
          ...updateData,
        },
      });
    }

    return this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  }

  // Admin User CRUD Logic
  async adminUpdateUser(userId: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Target user identity not found.');
    }

    const updateData: {
      status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
      rank?: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MENTOR' | 'TRAINER' | 'STUDENT' | 'CLIENT' | 'GUEST';
    } = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.rank) updateData.rank = dto.rank;

    const profileData = dto.profile;

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: updateData,
      });

      if (profileData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profileUpdateData: any = { ...profileData };
        await tx.profile.update({
          where: { userId },
          data: profileUpdateData,
        });
      }

      return updatedUser;
    });
  }

  async softDeleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Target user identity not found.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'INACTIVE' },
    });
  }

  async resetPassword(userId: string, newPasswordPlain: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Target user identity not found.');
    }

    const passwordHash = await bcrypt.hash(newPasswordPlain, 12);
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        loginAttempts: 0,
        lockUntil: null,
      },
    });
  }

  // Avatar Upload Architecture Hook
  async updateAvatarUrl(userId: string, avatarUrl: string) {
    return this.prisma.profile.update({
      where: { userId },
      data: { avatarUrl },
    });
  }

  async getActivityLogs(userId: string) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
