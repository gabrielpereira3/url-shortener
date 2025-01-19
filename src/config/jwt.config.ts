import {JwtModuleAsyncOptions} from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => ({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: process.env.JWT_EXPIRES_IN},
  }),
};
