import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_TOKEN_SECRET,
  jwtTokenExpireIn: process.env.JWT_TOKEN_EXPIRE_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN || '7d',
  jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE || 'http://localhost:3000',
  jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER || 'http://localhost:3000',
}));
