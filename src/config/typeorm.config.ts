import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
  retryAttempts: configService.get<number>('DATABASE_RETRY_ATTEMPTS') || 10,
  retryDelay: configService.get<number>('DATABASE_RETRY_DELAY') || 5000,
  autoLoadEntities: true,
});
