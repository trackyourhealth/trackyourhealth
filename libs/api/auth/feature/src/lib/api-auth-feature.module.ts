import { Module } from '@nestjs/common';
import { ApiAuthDataModule } from '@trackyourhealth/api/auth/data';

import { ApiAuthFeatureController } from './controllers/api-auth-feature.controller';
import { ApiAuthFeatureService } from './services/api-auth-feature.service';

@Module({
  imports: [ApiAuthDataModule],
  controllers: [ApiAuthFeatureController],
  providers: [ApiAuthFeatureService],
  exports: [],
})
export class ApiAuthFeatureModule {}
