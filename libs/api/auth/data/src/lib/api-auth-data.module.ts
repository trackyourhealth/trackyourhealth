import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PasswordHelper } from './helpers/password.helper';
import { ApiAuthDataService } from './services/api-auth-data.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('auth.jwt.secret'),
        signOptions: {
          expiresIn: config.get('auth.jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [ApiAuthDataService, JwtStrategy, PasswordHelper],
  exports: [ApiAuthDataService, PasswordHelper],
})
export class ApiAuthDataModule {}
