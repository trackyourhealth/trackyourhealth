import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { ApiHealthFeatureController } from './controllers/api-health-feature.controller';
import { PrismaHealthIndicator } from './health-indicator/prisma.health';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [ApiHealthFeatureController],
  providers: [PrismaHealthIndicator],
})
export class ApiHealthFeatureModule {}
