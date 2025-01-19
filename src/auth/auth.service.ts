import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import {AuthResponseDto} from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findOne({email});

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {sub: user.userId, email: user.email};

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
