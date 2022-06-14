import { Module } from '@nestjs/common';

import { ApiStudyDataService } from './api-study-data.service';

@Module({
  controllers: [],
  providers: [ApiStudyDataService],
  exports: [ApiStudyDataService],
})
export class ApiStudyDataModule {}
