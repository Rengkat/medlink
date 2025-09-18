import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      this.userService.create(createUserDto);
    } catch (error) {}
  }

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
