import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import authConfig from './config/auth.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      // TODO: Send verification email
      // await this.sendVerificationEmail(user.email, verificationToken);
      const verificationToken = this.generateVerificationToken();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await this.userService.updateUserByEmail(user.email, {
        verificationToken,
        verificationTokenExpiry: tokenExpiry,
      });

      return {
        message:
          'User registered successfully. Please check your email to verify your account.',
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string, email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        return { message: 'Email already verified' };
      }

      if (user.verificationToken !== token) {
        throw new UnauthorizedException('Invalid token');
      }

      if (
        user.verificationTokenExpiry &&
        user.verificationTokenExpiry < new Date()
      ) {
        throw new UnauthorizedException('Token expired');
      }

      const updatedUser = await this.userService.updateUserByEmail(email, {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      });

      return { message: 'Email verified successfully', user: updatedUser };
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findForLogin(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if user is verified
      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Please verify your email before logging in',
        );
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Your account has been deactivated');
      }

      // Validate password
      const isPasswordValid = await this.userService.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Return user without password
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);

      // Here you would typically generate JWT token
      const token = this.generateJwtToken(user);

      return {
        message: 'Login successful',
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      // Generate reset token
      const resetToken = this.generateResetToken();
      const tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await this.userService.updateUserByEmail(email, {
        verificationToken: resetToken,
        verificationTokenExpiry: tokenExpiry,
      });

      // Send reset email (implement this)
      // await this.sendResetEmail(email, resetToken);

      return { message: 'Password reset instructions sent to your email' };
    } catch (error) {
      // Don't reveal if email exists or not for security
      return {
        message: 'If the email exists, reset instructions have been sent',
      };
    }
  }

  async resetPassword(token: string, email: string, newPassword: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user.verificationToken !== token) {
        throw new UnauthorizedException('Invalid reset token');
      }

      if (
        user.verificationTokenExpiry &&
        user.verificationTokenExpiry < new Date()
      ) {
        throw new UnauthorizedException('Reset token has expired');
      }

      // Hash new password and update user
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.userService.updateUserByEmail(email, {
        password: hashedPassword,
        verificationToken: null,
        verificationTokenExpiry: null,
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

  logout() {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token. For server-side sessions, you'd invalidate the session here.
    return { message: 'Logged out successfully' };
  }

  async refreshToken() {
    // first decode it
    // const payload = await this.jwtService.verifyAsync(this.refreshToken, {
    //   secret: this.authConfiguration.refreshTokenSecret,
    // });
    //now find user using the ID from the payload
    // const user = await this.userService.findOneById(payload.sub);
    // This would typically validate a refresh token and issue a new access token
    throw new Error('Method not implemented');
  }

  // Helper methods
  private generateVerificationToken(): string {
    // Generate a random verification token
    return crypto.randomBytes(32).toString('hex');
  }

  private generateResetToken(): string {
    // Generate a random reset token
    return crypto.randomBytes(32).toString('hex');
  }

  private generateJwtToken(user: any): string {
    // Implement JWT token generation
    // Need to install and configure @nestjs/jwt
    // Example: return this.jwtService.sign(payload);
    return 'jwt-token-placeholder';
  }
}
