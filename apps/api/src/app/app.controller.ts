import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiAuthGuard } from './middlewares/auth.guard';
import { User } from './middlewares/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @UseGuards(ApiAuthGuard)
  @Get('foo')
  getFoo(@User() user) {
    console.log(user);
    return 'foo';
  }
}
