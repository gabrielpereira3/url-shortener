import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {UrlsController} from './urls.controller';
import {UrlsService} from './urls.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Url} from './entities/url.entity';
import {AuthModule} from 'src/auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {jwtConfig} from 'src/config/jwt.config';
import {User} from 'src/users/entities/user.entity';
import {UniqueRequestMiddleware} from './middlewares/unique-request.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url, User]),
    JwtModule.registerAsync(jwtConfig),
    AuthModule,
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UniqueRequestMiddleware).forRoutes(':token');
  }
}
