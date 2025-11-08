import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_HIERARCHY } from 'src/common/enums/user-role.enum';
import { UserRole } from 'src/common/user-role.enum';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // no role restriction

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: UserRole };

    if (!user) return false;

    // hierarchy check – higher number = more privileged
    const userLevel = ROLE_HIERARCHY[user.role];
    return requiredRoles.some((role) => ROLE_HIERARCHY[role] <= userLevel);
  }
}
