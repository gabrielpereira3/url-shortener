import {Test, TestingModule} from '@nestjs/testing';
import {Repository} from 'typeorm';
import {getRepositoryToken} from '@nestjs/typeorm';
import {NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {User} from 'src/users/entities/user.entity';
import {UsersService} from 'src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('mocked-hash');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockUser: User = {
        userId: '1',
        email: 'test@example.com',
        password: 'hashed',
      } as User;

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne({email: 'test@example.com'});

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOne({email: 'nonexistent@example.com'}),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: User = {
        userId: '1',
        email: createUserDto.email,
        password: 'mocked-hash',
        createdAt: new Date(),
      } as User;

      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        userId: mockUser.userId,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: 'mocked-hash',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
