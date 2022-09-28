import { Injectable } from '@nestjs/common';
import { Instrument } from '@prisma/client';

@Injectable()
export class ApiInstrumentEvaluationService {
  async evaluateInstrument(instrument: Instrument): Promise<boolean> {
    return instrument.questionnaire === instrument.evaluator;
  }
}
