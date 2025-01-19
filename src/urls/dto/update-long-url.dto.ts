import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsUrl} from 'class-validator';

export class UpdateLongUrlDto {
  @ApiProperty({
    example: 'https://updated-example.com',
    description: 'The new long URL to replace the existing one.',
  })
  @IsUrl()
  @IsNotEmpty()
  newLongUrl: string;
}
