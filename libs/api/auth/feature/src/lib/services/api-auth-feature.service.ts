import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiAuthDataService,
  PasswordHelper,
} from '@trackyourhealth/api/auth/data';

import { LoginRequest } from './../data/requests/login.request';
import { RegisterRequest } from './../data/requests/register.request';

@Injectable()
export class ApiAuthFeatureService {
  constructor(
    public readonly dataService: ApiAuthDataService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  async register(data: RegisterRequest) {
    const user = await this.dataService.createUser({
      email: data.email.trim(),
      password: data.password.trim(),
    });

    return this.dataService.generateToken({
      userId: user.id,
    });
  }

  async login(data: LoginRequest) {
    console.log(data);
    const user = await this.dataService.findUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Invalid Credentials.');
    }

    if (user.isVerified === false) {
      throw new ConflictException('This User is not verified.');
    }

    if (user.isBlocked) {
      throw new ConflictException('This User is blocked.');
    }

    const passwordValid = this.passwordHelper.validatePassword(
      data.password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid Credentials.');
    }

    return this.dataService.generateToken({
      userId: user.id,
    });
  }

  async logout() {
    return true;
  }
}
