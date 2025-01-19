import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsUrl} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The original URL to be shortened.',
  })
  @IsNotEmpty()
  @IsUrl()
  longUrl: string;
}
