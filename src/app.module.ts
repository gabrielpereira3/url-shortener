import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'url-shortener-db',
      entities: [],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      retryAttempts: 100,
      retryDelay: 10000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
