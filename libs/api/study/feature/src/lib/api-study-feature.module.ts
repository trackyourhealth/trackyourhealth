import { Module } from '@nestjs/common';

import { ApiStudyFeatureController } from './api-study-feature.controller';

@Module({
  controllers: [ApiStudyFeatureController],
  providers: [],
  exports: [],
})
export class ApiStudyFeatureModule {}
