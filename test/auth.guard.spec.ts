import {UnauthorizedException} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {JwtService} from '@nestjs/jwt';
import {AuthGuard} from 'src/auth/guards/auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      mockJwtService.verify.mockResolvedValue({
        userId: '123',
        email: 'test@example.com',
      });

      const result = await authGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockRequest['user']).toEqual({
        userId: '123',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      const mockRequest = {headers: {}};

      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('JWT token is missing'),
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      mockJwtService.verify.mockRejectedValue(new Error('Invalid token'));

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid JWT token'),
      );
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should return the token if the header is properly formatted', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const token = (authGuard as any).extractTokenFromHeader(mockRequest);
      expect(token).toBe('valid-token');
    });

    it('should return undefined if the header is improperly formatted', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidHeaderFormat',
        },
      };

      const token = (authGuard as any).extractTokenFromHeader(mockRequest);
      expect(token).toBeUndefined();
    });
  });
});
