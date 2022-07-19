import { Module } from '@nestjs/common';
import { ApiStudyDataModule } from '@trackyourhealth/api/study/data';

import { ApiStudyFeatureController } from './controllers/api-study-feature.controller';

@Module({
  controllers: [ApiStudyFeatureController],
  imports: [ApiStudyDataModule],
  providers: [],
  exports: [],
})
export class ApiStudyFeatureModule {}
