import { Controller, Get, UseGuards } from '@nestjs/common';
import { Session } from '@ory/kratos-client';
import { KratosGuard, KratosUser } from '@trackyourhealth/api/kratos/util';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @UseGuards(KratosGuard)
  @Get('foo')
  getFoo(@KratosUser() user: Session) {
    console.log(user.identity);
    return 'foo';
  }
}
