import { Module } from '@nestjs/common';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';
import { ApiStudiesModule } from '@trackyourhealth/api/studies';

@Module({
  imports: [ApiHealthFeatureModule, ApiStudiesModule],
})
export class ApiModule {}
