import { Module } from '@nestjs/common';
import { ApiAuthFeatureModule } from '@trackyourhealth/api/auth/feature';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';

@Module({
  imports: [ApiAuthFeatureModule, ApiHealthFeatureModule],
})
export class ApiModule {}
