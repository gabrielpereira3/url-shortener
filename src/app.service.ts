import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the NestJS URL Shortener API!';
  }
}
