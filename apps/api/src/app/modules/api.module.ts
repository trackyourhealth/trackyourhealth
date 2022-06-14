import { Module } from '@nestjs/common';
import { ApiHealthFeatureModule } from '@trackyourhealth/api/health/feature';

@Module({
  imports: [ApiHealthFeatureModule],
})
export class ApiModule {}
