import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './cache/redis.service';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  checkHealth() {
    return {
      status: 'operational',
      timestamp: new Date().toISOString(),
      service: 'HawkEdge REST API Engine',
      version: '1.0.0',
    };
  }

  checkLiveness() {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      memory: {
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      },
      cpu: process.cpuUsage(),
    };
  }

  async checkReadiness() {
    let dbStatus = 'OFFLINE';
    let dbLatencyMs = -1;
    let redisStatus = 'OFFLINE';
    let redisLatencyMs = -1;

    // Test Postgres connection
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
      dbStatus = 'ONLINE';
    } catch (e) {
      console.error('Readiness probe Database connection failure:', e);
    }

    // Test Redis connection
    try {
      const start = Date.now();
      const pingRes = await this.redis.ping();
      if (pingRes === 'PONG') {
        redisLatencyMs = Date.now() - start;
        redisStatus = 'ONLINE';
      }
    } catch (e) {
      console.error('Readiness probe Redis connection failure:', e);
    }

    const isHealthy = dbStatus === 'ONLINE' && redisStatus === 'ONLINE';

    return {
      healthy: isHealthy,
      status: isHealthy ? 'ready' : 'degraded',
      timestamp: new Date().toISOString(),
      dependencies: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        redis: {
          status: redisStatus,
          latencyMs: redisLatencyMs,
        },
      },
    };
  }
}
