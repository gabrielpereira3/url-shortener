import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
