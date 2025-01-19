import {Test, TestingModule} from '@nestjs/testing';
import {JwtService} from '@nestjs/jwt';
import {UnauthorizedException} from '@nestjs/common';
import {OptionalAuthGuard} from 'src/auth/guards/optional-auth.guard';

describe('OptionalAuthGuard', () => {
  let guard: OptionalAuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionalAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<OptionalAuthGuard>(OptionalAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no token is provided', async () => {
      const mockRequest = {
        headers: {},
      };

      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      };

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(jwtService.verify).not.toHaveBeenCalled();
    });

    it('should return true and set user if token is valid', async () => {
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

      const mockPayload = {userId: '123', email: 'test@example.com'};
      mockJwtService.verify.mockResolvedValue(mockPayload);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockRequest['user']).toEqual(mockPayload);
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

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new UnauthorizedException('Invalid JWT token'),
      );

      expect(jwtService.verify).toHaveBeenCalledWith('invalid-token', {
        secret: process.env.JWT_SECRET,
      });
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should return the token if the header is properly formatted', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const token = (guard as any).extractTokenFromHeader(mockRequest);
      expect(token).toBe('valid-token');
    });

    it('should return undefined if the header is improperly formatted', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidHeaderFormat',
        },
      };

      const token = (guard as any).extractTokenFromHeader(mockRequest);
      expect(token).toBeUndefined();
    });
  });
});
