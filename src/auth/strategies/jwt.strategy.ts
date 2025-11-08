import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/common/enums/user-role.enum';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';
import { UserService } from 'src/user/user.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface RequestUser {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //   private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret'),
      audience: configService.get<string>('auth.jwtTokenAudience'),
      issuer: configService.get<string>('auth.jwtTokenIssuer'),
      passReqToCallback: true,
    } as any);
  }

  async validate(_request: any, payload: JwtPayload): Promise<RequestUser> {
    try {
      if (!payload.sub || !payload.email || !payload.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      if (user.email !== payload.email) {
        throw new UnauthorizedException('Token email mismatch');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
      };
    } catch (error) {
      //   this.logger.error(`JWT validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
