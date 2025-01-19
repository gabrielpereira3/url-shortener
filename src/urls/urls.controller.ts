import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {UrlsService} from './urls.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {AuthenticatedRequest} from '../common/types/express-request.interface';
import {OptionalAuthGuard} from 'src/auth/guards/optional-auth.guard';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @UseGuards(OptionalAuthGuard)
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.urlsService.shortenUrl(createUrlDto, req?.user);
  }
}
