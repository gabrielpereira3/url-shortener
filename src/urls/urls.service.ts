import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Url} from './entities/url.entity';
import {Repository} from 'typeorm';
import {CreateUrlDto} from './dto/create-url.dto';
import {User} from 'src/users/entities/user.entity';
import {ConfigService} from '@nestjs/config';
import {ShortenUrlResponseDto} from './dto/shorten-url-response.dto';
import {ListUrlReponseDto} from './dto/list-url-response.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async shortenUrl(
    createUrlDto: CreateUrlDto,
    user?: User,
  ): Promise<ShortenUrlResponseDto> {
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

  async listByUserId(user: User): Promise<ListUrlReponseDto[]> {
    const userEntity = await this.getUserByEmail(user.email);

    const urls = await this.urlRepository
      .createQueryBuilder('url')
      .innerJoinAndSelect('url.user', 'user')
      .where('user.userId = :userId', {userId: userEntity.userId})
      .andWhere('url.deletedAt IS NULL')
      .orderBy('url.createdAt', 'DESC')
      .getMany();

    const baseUrl = this.configService.get<string>('BASE_URL');
    const apiPort = this.configService.get<string>('API_PORT');

    return urls.map((url) => ({
      urlId: url.urlId,
      longUrl: url.longUrl,
      shortUrl: `${baseUrl}:${apiPort}/${url.token}`,
      clicks: url.clicks,
    }));
  }

  async updateLongUrl(token: string, newLongUrl: string, user: User) {
    const userEntity = await this.getUserByEmail(user.email);
    const url = await this.getUrlByTokenAndUser(token, userEntity);
    url.longUrl = newLongUrl;
    await this.urlRepository.save(url);
  }

  async deleteUrl(token: string, user: User) {
    const userEntity = await this.getUserByEmail(user.email);
    const url = await this.getUrlByTokenAndUser(token, userEntity);
    await this.urlRepository.softRemove(url);
  }

  private async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({email});

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async getUrlByTokenAndUser(token: string, user: User): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: {token, user: {userId: user.userId}},
    });

    if (!url) {
      throw new NotFoundException(
        'URL token not found or does not belong to the user',
      );
    }

    return url;
  }
}
