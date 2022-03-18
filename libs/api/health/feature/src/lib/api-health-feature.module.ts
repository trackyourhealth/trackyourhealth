import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { ApiHealthFeatureController } from './controllers/api-health-feature.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [ApiHealthFeatureController],
  providers: [],
})
export class ApiHealthFeatureModule {}
