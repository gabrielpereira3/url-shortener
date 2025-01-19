import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from 'src/auth/auth.controller';
import {AuthService} from 'src/auth/auth.service';
import {SignInDto} from 'src/auth/dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token on successful login', async () => {
      // Mock do retorno do serviço de autenticação
      const mockToken = {accessToken: 'mocked-jwt-token'};
      mockAuthService.signIn.mockResolvedValue(mockToken);

      const dto: SignInDto = {
        email: 'user@example.com',
        password: 'password123',
      };
      const result = await controller.signIn(dto);

      expect(result).toEqual(mockToken);
      expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
    });

    it('should throw an error on invalid credentials', async () => {
      // Mock para simular erro
      mockAuthService.signIn.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      const dto: SignInDto = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      await expect(controller.signIn(dto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(authService.signIn).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });
});
