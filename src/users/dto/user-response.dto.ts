import {ApiProperty} from '@nestjs/swagger';

export class UserReponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique ID of the user',
  })
  userId: string;

  @ApiProperty({example: 'user@example.com', description: 'Email of the user'})
  email: string;

  @ApiProperty({
    example: '2025-01-19T20:30:00.000Z',
    description: 'Date when the user was created',
  })
  createdAt: Date;
}
