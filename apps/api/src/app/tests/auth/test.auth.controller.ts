import { Controller, Get } from '@nestjs/common';
import { Endpoint } from '@trackyourhealth/api/common/util';

@Controller('tests')
export class AuthTestController {
  @Get('locked')
  @Endpoint({
    authentication: {
      required: true,
    },
  })
  lockedEndpoint() {
    return 'locked';
  }

  @Get('open')
  @Endpoint({
    authentication: {
      required: false,
    },
  })
  openEndpoint() {
    return 'unlocked';
  }
}
