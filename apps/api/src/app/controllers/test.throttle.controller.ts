import { Controller, Get, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('tests')
export class ThrottleTestController {
  @Get()
  @UseGuards(ThrottlerGuard)
  throttle() {
    return 'ok';
  }
}
