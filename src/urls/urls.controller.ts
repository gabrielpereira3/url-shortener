import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {UrlsService} from './urls.service';
import {CreateUrlDto} from './dto/create-url.dto';
import {AuthenticatedRequest} from '../common/types/express-request.interface';
import {OptionalAuthGuard} from 'src/auth/guards/optional-auth.guard';
import {Response} from 'express';
import {AuthGuard} from 'src/auth/guards/auth.guard';
import {UpdateLongUrlDto} from './dto/update-long-url.dto';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls/shorten')
  @UseGuards(OptionalAuthGuard)
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.urlsService.shortenUrl(createUrlDto, req?.user);
  }

  @Get(':token')
  async redirect(@Param('token') token: string, @Res() res: Response) {
    const url = await this.urlsService.findByToken(token);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlsService.incrementClickCount(url);

    return res.redirect(url.longUrl);
  }

  @Get('urls/listByUser')
  @UseGuards(AuthGuard)
  async listByUser(@Request() req: AuthenticatedRequest) {
    return this.urlsService.listByUserId(req.user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('urls/update/:token')
  @UseGuards(AuthGuard)
  async updateLongUrl(
    @Param('token') token: string,
    @Body() updateLongUrlDto: UpdateLongUrlDto,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.urlsService.updateLongUrl(
      token,
      updateLongUrlDto.newLongUrl,
      req.user,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('urls/delete/:token')
  @UseGuards(AuthGuard)
  async deleteUrl(
    @Param('token') token: string,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.urlsService.deleteUrl(token, req.user);
  }
}
