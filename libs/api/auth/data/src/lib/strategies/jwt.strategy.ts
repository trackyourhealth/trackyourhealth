import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtModel } from './../models/jwt.model';
import { ApiAuthDataService } from './../services/api-auth-data.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly auth: ApiAuthDataService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.jwt.secret'),
      signOptions: {
        expiresIn: configService.get('auth.jwt.expiresIn'),
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtModel) {
    const user = await this.auth.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
