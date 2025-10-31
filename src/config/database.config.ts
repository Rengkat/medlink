import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12345',
  database: 'MedLink',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
}));
