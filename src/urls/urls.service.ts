import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Url} from './entities/url.entity';
import {Repository} from 'typeorm';
import {CreateUrlDto} from './dto/create-url.dto';
import {User} from 'src/users/entities/user.entity';
import {UrlResponseDto} from './dto/url-response-dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly configService: ConfigService,
  ) {}

  async shortenUrl(
    createUrlDto: CreateUrlDto,
    user?: User,
  ): Promise<UrlResponseDto> {
    const token = this.generateToken();

    let fullUser: User | null = null;

    if (user) {
      fullUser = await this.urlRepository.manager.findOne(User, {
        where: {email: user.email},
      });
    }

    const url = this.urlRepository.create({
      longUrl: createUrlDto.longUrl,
      token,
      user: fullUser,
      clicks: 0,
    });

    const urlReponse = await this.urlRepository.save(url);

    const baseUrl = this.configService.get<string>('BASE_URL');
    const apiPort = this.configService.get<string>('API_PORT');

    return {
      urlId: urlReponse.urlId,
      longUrl: urlReponse.longUrl,
      shortUrl: `${baseUrl}:${apiPort}/${urlReponse.token}`,
      createdAt: urlReponse.createdAt,
    };
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  findByToken(token: string): Promise<Url> {
    return this.urlRepository.findOne({where: {token}});
  }

  async incrementClickCount(url: Url): Promise<void> {
    url.clicks += 1;
    await this.urlRepository.save(url);
  }
}
