import { Module } from '@nestjs/common';

import { ApiStudiesController } from './api-studies.controller';
import { ApiStudiesService } from './api-studies.service';

@Module({
  controllers: [ApiStudiesController],
  providers: [ApiStudiesService],
  exports: [ApiStudiesService],
})
export class ApiStudiesModule {}
