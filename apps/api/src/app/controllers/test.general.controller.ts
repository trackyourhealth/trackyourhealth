import { Controller, Get } from '@nestjs/common';

@Controller('tests')
export class GeneralTestController {
  @Get()
  index() {
    return 'ok';
  }
}
