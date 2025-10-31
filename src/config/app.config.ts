import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.ENV_MODE || 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
}));
