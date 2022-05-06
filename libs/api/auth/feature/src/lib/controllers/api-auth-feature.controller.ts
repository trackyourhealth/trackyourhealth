import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CredentialsModel } from '@trackyourhealth/api/auth/data';
import { ApiUser } from '@trackyourhealth/api/common/util';
import { OpenApiEndpoint } from '@trackyourhealth/api/common/util';

import { LoginRequest } from './../data/requests/login.request';
import { RegisterRequest } from './../data/requests/register.request';
import { ApiAuthFeatureService } from './../services/api-auth-feature.service';

@Controller('auth')
export class ApiAuthFeatureController {
  constructor(private readonly service: ApiAuthFeatureService) {}

  @OpenApiEndpoint({
    meta: {
      summary: 'Login',
      description: 'Authenticate against the API to get a valid JWT.',
      tags: ['auth'],
    },
    request: {},
    response: {
      status: HttpStatus.CREATED,
    },
    authentication: {
      required: false,
    },
  })
  @Post('login')
  public async login(@Body() request: LoginRequest) {
    const accessToken = await this.service.login(request);
    return accessToken;
  }

  @Post('register')
  public async registerUser(@Body() request: RegisterRequest) {
    const dto: CredentialsModel = {
      email: request.email,
      password: request.password,
    };
    const accessToken = this.service.register(dto);
    return accessToken;
  }

  @Delete('logout')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async logout(@ApiUser() user: User) {
    await this.service.logout();
    return;
  }
}
