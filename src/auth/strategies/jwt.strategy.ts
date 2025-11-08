// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { UserService } from '../../user/user.service';
// import { UserRole } from '../../../common/enums/user-role.enum';

// export interface JwtPayload {
//   sub: number;
//   email: string;
//   role: UserRole;
//   iat?: number;
//   exp?: number;
// }

// export interface RequestUser {
//   id: number;
//   email: string;
//   role: UserRole;
//   firstName: string;
//   lastName: string;
//   isActive: boolean;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   private readonly logger = new Logger(JwtStrategy.name);

//   constructor(
//     private configService: ConfigService,
//     private userService: UserService,
//     // private authConfig:
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         ExtractJwt.fromAuthHeaderAsBearerToken(),
//         ExtractJwt.fromUrlQueryParameter('token'),
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET'),
//       passReqToCallback: true,
//     });
//   }

//   async validate(request: any, payload: JwtPayload): Promise<RequestUser> {
//     try {
//       // Validate payload structure
//       if (!payload.sub || !payload.email || !payload.role) {
//         throw new UnauthorizedException('Invalid token payload');
//       }

//       // Find user in database
//       const user = await this.userService.findOneById(payload.sub);

//       if (!user) {
//         throw new UnauthorizedException('User not found');
//       }

//       if (!user.isActive) {
//         throw new UnauthorizedException('User account is deactivated');
//       }

//       // Verify token email matches user email
//       if (user.email !== payload.email) {
//         throw new UnauthorizedException('Token email mismatch');
//       }

//       // Return user data that will be available in req.user
//       return {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         isActive: user.isActive,
//       };
//     } catch (error) {
//       this.logger.error(`JWT Validation failed: ${error.message}`, error.stack);
//       throw error;
//     }
//   }
// }
