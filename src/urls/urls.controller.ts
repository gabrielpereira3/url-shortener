import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {ShortenUrlResponseDto} from './dto/shorten-url-response.dto';
import {ListUrlReponseDto} from './dto/list-url-response.dto';

@ApiTags('Urls')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls/shorten')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({summary: 'Shorten a URL'})
  @ApiResponse({
    status: 201,
    description: 'URL shortened successfully.',
    type: ShortenUrlResponseDto,
  })
  @ApiResponse({status: 400, description: 'Invalid input data.'})
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.urlsService.shortenUrl(createUrlDto, req?.user);
  }

  @Get(':token')
  @ApiOperation({summary: 'Redirect to the original URL'})
  @ApiParam({
    name: 'token',
    description: 'The unique token associated with the shortened URL.',
    example: 'aZbKq7',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection successful.',
  })
  @ApiResponse({status: 404, description: 'URL not found.'})
  async redirect(@Param('token') token: string, @Res() res: Response) {
    const url = await this.urlsService.findByToken(token);
    await this.urlsService.incrementClickCount(url);
    return res.redirect(HttpStatus.FOUND, url.longUrl);
  }

  @Get('urls/listByUser')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'List URLs created by the authenticated user'})
  @ApiResponse({
    status: 200,
    description: 'List of URLs created by the user.',
    type: [ListUrlReponseDto],
  })
  @ApiResponse({status: 401, description: 'User not authenticated.'})
  async listByUser(@Request() req: AuthenticatedRequest) {
    return this.urlsService.listByUserId(req.user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('urls/update/:token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update the long URL for a shortened URL'})
  @ApiParam({
    name: 'token',
    description: 'The unique token of the shortened URL to be updated.',
    example: 'aZbKq7',
  })
  @ApiResponse({
    status: 204,
    description: 'URL updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or does not belong to the user.',
  })
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
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete a shortened URL'})
  @ApiParam({
    name: 'token',
    description: 'The unique token of the shortened URL to be updated.',
    example: 'aZbKq7',
  })
  @ApiResponse({
    status: 204,
    description: 'URL deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found or does not belong to the user.',
  })
  async deleteUrl(
    @Param('token') token: string,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.urlsService.deleteUrl(token, req.user);
  }
}
