import { Module } from '@nestjs/common';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';
import { ApiStudyFeatureModule } from '@trackyourhealth/api/study/feature';

@Module({
  imports: [ApiHealthFeatureModule, ApiStudyFeatureModule],
})
export class ApiModule {}
