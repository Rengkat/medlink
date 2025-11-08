// src/auth/config/auth.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_TOKEN_SECRET,
  jwtTokenExpireIn: process.env.JWT_TOKEN_EXPIRE_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN || '7d',
  jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE || 'my-app',
  jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER || 'my-app-backend',
}));
