import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Memory store fallback for rate limiting
const rateLimitMemoryStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Helmet Emulator (Security Headers)
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-XSS-Protection', '0');
    
    // Content Security Policy (CSP)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; base-uri 'self'; font-src 'self' https: data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: https:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests"
    );

    // 2. Custom Lightweight Rate Limiter (100 requests per minute)
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const limit = 150; // max requests per window
    const windowMs = 60000; // 1 minute window

    let record = rateLimitMemoryStore.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitMemoryStore.set(ip, record);
    } else {
      record.count++;
    }

    // Set Rate Limit Headers
    const remaining = Math.max(0, limit - record.count);
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > limit) {
      console.warn(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        type: 'RATE_LIMIT_EXCEEDED',
        ip,
        url: req.originalUrl,
      }));

      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests from this IP, please try again after a minute.',
        error: 'Too Many Requests',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  }
}
