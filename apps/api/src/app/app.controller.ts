import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  KratosGuard,
  KratosSession,
  KratosUser,
} from '@trackyourhealth/api/kratos/util';

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
  getFoo(@KratosUser() user: KratosSession) {
    console.log(user.identity);
    return 'foo';
  }
}
