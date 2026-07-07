import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkRankClearance } from '@hawkedge/auth';
import { UserRank } from '@hawkedge/types';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRanks = this.reflector.getAllAndOverride<UserRank[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRanks || requiredRanks.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const hasClearance = checkRankClearance(user.rank, requiredRanks);
    if (!hasClearance) {
      throw new ForbiddenException('Access denied. Insufficient role permissions clearance rank.');
    }

    return true;
  }
}
