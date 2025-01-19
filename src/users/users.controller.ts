import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {UserReponseDto} from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  @ApiOperation({summary: 'Create a new user'})
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: UserReponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error: Invalid input data.',
  })
  @ApiResponse({status: 400, description: 'Invalid input data.'})
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
