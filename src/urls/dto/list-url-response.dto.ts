import {ApiProperty} from '@nestjs/swagger';

export class ListUrlReponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique ID of the shortened URL.',
  })
  urlId: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'The original URL.',
  })
  longUrl: string;

  @ApiProperty({
    example: 'http://short.ly/abc123',
    description: 'The shortened URL.',
  })
  shortUrl: string;

  @ApiProperty({
    example: 10,
    description: 'Number of clicks the shortened URL has received.',
  })
  clicks: number;
}
