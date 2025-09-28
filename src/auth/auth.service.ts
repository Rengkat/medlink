import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      // Generate a verification token and
      // send a verification email here
      return user;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string, email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (user.isVerify) {
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
        isVerify: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      });
      return { message: 'Email verified successfully', user: updatedUser };
    } catch (error) {
      throw error;
    }
  }
  //activate
  validateUser() {
    return `This action returns all auth`;
  }

  login() {
    return `This action returns a  auth`;
  }

  forgotPassword() {}

  resetPassword() {}

  logout() {}

  refreshToken() {}
}
