import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcryptjs';

@Injectable()
export class PasswordHelper {
  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get('auth.jwt');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  constructor(private configService: ConfigService) {}

  validatePassword(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }

  hashPassword(password: string): string {
    return hashSync(
      password,
      this.configService.get('auth.jwt.bcryptSaltRounds'),
    );
  }
}
