import {Test, TestingModule} from '@nestjs/testing';
import {UsersService} from 'src/users/users.service';
import {JwtService} from '@nestjs/jwt';
import {UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {AuthService} from 'src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {userId: '123', email, password: hashedPassword};

      mockUsersService.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mocked-jwt-token');

      const result = await authService.signIn(email, password);

      expect(result).toEqual({accessToken: 'mocked-jwt-token'});
      expect(usersService.findOne).toHaveBeenCalledWith({email});
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.userId,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        authService.signIn('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'user@example.com';
      const password = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const user = {userId: '123', email, password: hashedPassword};

      mockUsersService.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.findOne).toHaveBeenCalledWith({email});
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
  });
});
