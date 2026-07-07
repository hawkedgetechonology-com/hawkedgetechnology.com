import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { PERMISSIONS_KEY } from '../decorators';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.id) {
      return false;
    }

    // Fetch user permissions from database relations
    const userWithRolesAndPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
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

    if (!userWithRolesAndPermissions) {
      return false;
    }

    // Flatten all permissions assigned to user's roles
    const userPermissions = new Set<string>();
    for (const userRole of userWithRolesAndPermissions.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        if (rolePermission.permission && rolePermission.permission.name) {
          userPermissions.add(rolePermission.permission.name);
        }
      }
    }

    // Super Admin has absolute master access
    if (user.rank === 'SUPER_ADMIN') {
      return true;
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.has(perm));
    if (!hasAllPermissions) {
      throw new ForbiddenException('Access denied. Insufficient granular permission keys.');
    }

    return true;
  }
}
