import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../cache/redis.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService Unit Tests', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockUserHash = bcrypt.hashSync('Password@123', 10);

  const mockUser = {
    id: 'user_123',
    email: 'rohit@velohealth.tech',
    passwordHash: mockUserHash,
    status: 'ACTIVE',
    rank: 'STUDENT',
    loginAttempts: 0,
    lockUntil: null,
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.email === 'rohit@velohealth.tech') {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      }),
      update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ ...mockUser, ...data })),
    },
    session: {
      create: jest.fn().mockResolvedValue({ id: 'sess_123' }),
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
  };

  const mockRedis = {
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: RedisService,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login validation', () => {
    it('should issue tokens for correct coordinates credentials', async () => {
      const loginDto = { email: 'rohit@velohealth.tech', password: 'Password@123' };
      const result = await service.login(loginDto, '127.0.0.1', 'Mozilla');
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException for incorrect password coordinates', async () => {
      const loginDto = { email: 'rohit@velohealth.tech', password: 'WrongPassword' };
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if account lockout time is active', async () => {
      const lockedUser = {
        ...mockUser,
        lockUntil: new Date(Date.now() + 10 * 60000),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(lockedUser as any);

      const loginDto = { email: 'rohit@velohealth.tech', password: 'Password@123' };
      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('MFA Architecture', () => {
    it('should initialize TOTP secret and backup codes on enable request', async () => {
      const result = await service.mfaEnable('user_123');
      expect(result).toBeDefined();
      expect(result.secret).toBeDefined();
      expect(result.backupCodes.length).toBe(8);
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should verify and configure mfa status to true on correct token submission', async () => {
      const activeUser = {
        ...mockUser,
        mfaSecret: 'JBSWY3DPEHPK3PXP',
        mfaBackupCodes: ['ABCD-1234'],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(activeUser as any);

      const result = await service.mfaVerify('user_123', '123456');
      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should disable MFA and purge secrets on disable request', async () => {
      const result = await service.mfaDisable('user_123');
      expect(result.success).toBe(true);
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
