import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { ApiInstrumentDataService } from './api-instrument-data.service';
import { ApiInstrumentEvaluationService } from './api-instrument-evaluation.service';
import { InstrumentHandler } from './event-handlers/evaluate-instrument.handler';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [],
  providers: [
    ApiInstrumentDataService,
    ApiInstrumentEvaluationService,
    PrismaService,
    InstrumentHandler,
  ],
  exports: [ApiInstrumentDataService, ApiInstrumentEvaluationService],
})
export class ApiInstrumentDataModule {}
