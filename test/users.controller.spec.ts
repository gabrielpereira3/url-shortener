import {Test, TestingModule} from '@nestjs/testing';
import {ConflictException} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {UsersController} from 'src/users/users.controller';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {UserReponseDto} from 'src/users/dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: UserReponseDto = {
        userId: '123',
        email: createUserDto.email,
        createdAt: new Date(),
      };

      mockUsersService.create.mockResolvedValue(mockResponse);

      const result = await controller.signUp(createUserDto);

      expect(result).toEqual(mockResponse);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersService.create.mockRejectedValue(
        new ConflictException('User already exists'),
      );

      await expect(controller.signUp(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
