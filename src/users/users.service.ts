import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {User} from './entities/user.entity';
import {UserReponseDto} from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(criteria: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy(criteria);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserReponseDto> {
    const criteria: Partial<User> = {email: createUserDto.email};
    if (await this.userRepository.findOneBy(criteria)) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      userId: savedUser.userId,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };
  }
}
