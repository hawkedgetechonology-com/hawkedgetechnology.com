import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UserService Unit Tests', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user_123',
    email: 'rohit@velohealth.tech',
    passwordHash: 'hashed_password',
    status: 'ACTIVE',
    rank: 'CLIENT',
  };

  const mockProfile = {
    userId: 'user_123',
    firstName: 'Rohit',
    lastName: 'Sharma',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === 'user_123' || where.email === 'rohit@velohealth.tech') {
          return Promise.resolve({
            ...mockUser,
            profile: mockProfile,
            userRoles: [],
          });
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          ...mockUser,
          ...data,
        });
      }),
    },
    profile: {
      findUnique: jest.fn().mockResolvedValue(mockProfile),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve(data)),
      update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockProfile, ...data })),
    },
    auditLog: {
      findMany: jest.fn().mockResolvedValue([{ id: 'log_123', action: 'USER_LOGIN' }]),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return user record with profile matching user id', async () => {
      const result = await service.findById('user_123');
      expect(result).toBeDefined();
      expect(result.id).toBe('user_123');
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user id is missing', async () => {
      await expect(service.findById('non_existing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile coordinates', async () => {
      const updateDto = { firstName: 'Updated' };
      const result = await service.updateProfile('user_123', updateDto);
      expect(result).toBeDefined();
      expect(prisma.profile.update).toHaveBeenCalled();
    });
  });

  describe('softDeleteUser', () => {
    it('should update user status to INACTIVE', async () => {
      const result = await service.softDeleteUser('user_123');
      expect(result.status).toBe('INACTIVE');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('getActivityLogs', () => {
    it('should fetch and return activity logs list matching user id', async () => {
      const result = await service.getActivityLogs('user_123');
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].action).toBe('USER_LOGIN');
      expect(prisma.auditLog.findMany).toHaveBeenCalled();
    });
  });
});
