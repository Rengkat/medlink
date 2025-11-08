import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Try to authenticate but don't throw error if fails
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // No error thrown - return user if exists, otherwise return null
    if (err || !user) {
      return null;
    }
    return user;
  }
}
