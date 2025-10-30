import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() user: VerifyEmailDto) {
    return this.authService.verifyEmail(user.token, user.email);
  }

  @Post('/login')
  login(@Body() user: LoginDto) {
    return this.authService.login(user.email, user.password);
  }

  @Get('/me')
  getCurrentUser() {}

  @Post('/forgot-password')
  forgotPassword() {}

  @Post('/reset-password')
  resetPassword() {}

  @Post('/logout')
  logout() {}

  @Post('')
  refreshToken() {}
}
