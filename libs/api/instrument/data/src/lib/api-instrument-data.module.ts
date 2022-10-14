import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { InstrumentHandler } from './event-handlers/evaluate-instrument.handler';
import { ApiInstrumentDataService } from './services/api-instrument-data.service';
import { ApiInstrumentEvaluationService } from './services/api-instrument-evaluation.service';
import { InstrumentCrudService } from './services/instrument.crud.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [],
  providers: [
    ApiInstrumentDataService,
    ApiInstrumentEvaluationService,
    PrismaService,
    InstrumentHandler,
    InstrumentCrudService,
  ],
  exports: [ApiInstrumentDataService, ApiInstrumentEvaluationService],
})
export class ApiInstrumentDataModule {}
