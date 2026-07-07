import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { UserRank } from '@hawkedge/types';

export const ROLES_KEY = 'ranks';
export const Roles = (...ranks: UserRank[]) => SetMetadata(ROLES_KEY, ranks);

export function AuthRank(...ranks: UserRank[]) {
  return applyDecorators(
    Roles(...ranks),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

export function AuthPermission(...permissions: string[]) {
  return applyDecorators(
    Permissions(...permissions),
    UseGuards(JwtAuthGuard, PermissionsGuard),
  );
}

export * from './current-user.decorator';
