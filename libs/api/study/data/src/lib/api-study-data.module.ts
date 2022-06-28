import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { ApiStudyDataService } from './services/api-study-data.service';

@Module({
  controllers: [],
  providers: [ApiStudyDataService, PrismaService],
  exports: [ApiStudyDataService],
})
export class ApiStudyDataModule {}
