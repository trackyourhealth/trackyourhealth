import { Module } from '@nestjs/common';
import { ApiAuthFeatureModule } from '@trackyourhealth/api/auth/feature';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';
import { ApiStudiesModule } from '@trackyourhealth/api/studies';

@Module({
  imports: [ApiAuthFeatureModule, ApiHealthFeatureModule, ApiStudiesModule],
})
export class ApiModule {}
