import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Instrument } from '@prisma/client';

import { ApiInstrumentEvaluationService } from '../services/api-instrument-evaluation.service';

@Injectable()
export class InstrumentHandler {
  constructor(
    private readonly apiInstrumentEvaluation: ApiInstrumentEvaluationService,
  ) {}

  @OnEvent('instrument.created', { async: true })
  async handleAnswersCreatedEvent(payload: Instrument): Promise<void> {
    await this.apiInstrumentEvaluation.evaluateInstrument(payload);
  }
}
