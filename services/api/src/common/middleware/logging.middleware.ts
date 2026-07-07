import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    
    // Attach to request and response
    req['requestId'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    // Log the request initiation as structured JSON
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      type: 'HTTP_REQUEST',
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || 'unknown',
    }));

    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      
      // Log response completion
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: res.statusCode >= 400 ? 'WARN' : 'INFO',
        type: 'HTTP_RESPONSE',
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs,
      }));
    });

    next();
  }
}
