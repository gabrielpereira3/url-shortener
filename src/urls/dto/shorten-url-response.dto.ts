import {ApiProperty} from '@nestjs/swagger';

export class ShortenUrlResponseDto {
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
    example: '2025-01-19T20:30:00.000Z',
    description: 'The date the URL was created.',
  })
  createdAt: Date;
}
