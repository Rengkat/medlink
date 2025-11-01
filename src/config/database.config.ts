import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_NAME || 'postgres',
  password: process.env.PASSWORD,
  database: process.env.db_name,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.SYNC_DB === 'true' ? true : false,
  autoLoadEntities: process.env.AUTO_LOAD_ENTITIES === 'true' ? true : false,
}));
