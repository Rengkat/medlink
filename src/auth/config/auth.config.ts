import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_TOKEN_SECRET,
  jwtTokenExpireIn: process.env.JWT_TOKEN_EXPIRE_IN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
  jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE,
  jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER,
}));
