import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { PasswordHelper } from './../helpers/password.helper';
import { AccessTokenModel } from './../models/access-token.model';
import { CredentialsModel } from './../models/credentials.model';

@Injectable()
export class ApiAuthDataService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordHelper: PasswordHelper,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  generateToken(payload: { userId: string }): AccessTokenModel {
    const jwtConfig = this.configService.get('auth.jwt');

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshIn,
    });

    return {
      accessToken: accessToken,
      tokenType: 'Bearer',
      refreshToken: refreshToken,
      expiresIn: jwtConfig.expiresIn,
    };
  }

  validateUser(userId: string) {
    return this.findUserById(userId);
  }

  getUserFromToken(token: string) {
    const userId = this.jwtService.decode(token)['userId'];
    return this.findUserById(userId);
  }

  public async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  public async findUserById(userId: string) {
    return await this.prismaService.user.findUnique({ where: { id: userId } });
  }

  async createUser(credentials: CredentialsModel) {
    try {
      return await this.prismaService.user.create({
        data: {
          email: credentials.email,
          password: this.passwordHelper.hashPassword(credentials.password),
          isBlocked: false,
          isVerified: true,
        },
      });
    } catch (error) {
      throw new ConflictException('User already exists');
    }
  }
}
