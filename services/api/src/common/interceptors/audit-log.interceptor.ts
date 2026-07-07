import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, ip } = request;

    return next.handle().pipe(
      tap(async (data) => {
        // Track actions for write operations or key auth endpoints
        const isAuthAction = url.includes('/auth/');
        const isWriteAction = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        
        if (!isAuthAction && !isWriteAction) return;

        let action = `${method}:${url}`;
        let targetUserId = user?.id || null;

        // Custom mappings for key user actions
        if (url.includes('/auth/login')) {
          action = 'USER_LOGIN';
          targetUserId = (data as { user?: { id?: string } })?.user?.id || null;
        } else if (url.includes('/auth/logout')) {
          action = 'USER_LOGOUT';
        } else if (url.includes('/auth/register')) {
          action = 'USER_REGISTER';
          targetUserId = (data as { user?: { id?: string } })?.user?.id || null;
        } else if (url.includes('/auth/change-password')) {
          action = 'PASSWORD_CHANGED';
        } else if (url.includes('/auth/reset-password')) {
          action = 'PASSWORD_RESET';
        } else if (url.includes('/user/profile')) {
          action = 'PROFILE_UPDATED';
        } else if (url.includes('/project') && method === 'POST') {
          action = 'PROJECT_CREATED';
        } else if (url.includes('/invoice') && method === 'POST') {
          action = 'INVOICE_SENT';
        } else if (url.includes('/meeting') && method === 'POST') {
          action = 'MEETING_SCHEDULED';
        } else if (url.includes('/certificate') && method === 'POST') {
          action = 'CERTIFICATE_GENERATED';
        }

        // Generate the Audit Log record
        try {
          await this.prisma.auditLog.create({
            data: {
              userId: targetUserId,
              action,
              ipAddress: ip || request.headers['x-forwarded-for'] || request.socket.remoteAddress,
              userAgent: request.headers['user-agent'] || null,
              details: {
                method,
                url,
                payloadKeys: request.body ? Object.keys(request.body).filter(k => k !== 'password') : [],
                success: true,
              },
            },
          });
        } catch (err) {
          // Fail silently to prevent interrupting main request flow
          // eslint-disable-next-line no-console
          console.error('Audit logging failed:', err);
        }
      }),
    );
  }
}
