import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  register() {}

  @Get()
  verifyEmail() {}

  @Post()
  login() {}

  @Get()
  getCurrentUser() {}

  @Post()
  forgotPassword() {}

  @Post()
  resetPassword() {}

  @Post()
  logout() {}
  @Post()
  refreshToken() {}
}
