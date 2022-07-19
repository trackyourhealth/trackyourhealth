import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { ApiStudyDataService } from './services/api-study-data.service';
import { StudyCrudService } from './services/study.crud.service';

@Module({
  controllers: [],
  providers: [ApiStudyDataService, PrismaService, StudyCrudService],
  exports: [ApiStudyDataService, StudyCrudService],
})
export class ApiStudyDataModule {}
