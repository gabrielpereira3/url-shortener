import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class SignInDto {
  @ApiProperty({example: 'user@example.com', description: 'User email address'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'password123', description: 'User password'})
  @IsNotEmpty()
  @IsString()
  password: string;
}
