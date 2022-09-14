import { Module } from '@nestjs/common';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';
import { ApiInstrumentFeatureModule } from '@trackyourhealth/api/instrument/feature';
import { ApiStudyFeatureModule } from '@trackyourhealth/api/study/feature';

@Module({
  imports: [
    ApiHealthFeatureModule,
    ApiStudyFeatureModule,
    ApiInstrumentFeatureModule,
  ],
})
export class ApiModule {}
