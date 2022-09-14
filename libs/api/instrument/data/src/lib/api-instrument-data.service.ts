import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Instrument, Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class ApiInstrumentDataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllInstruments() {
    return 'hello from instruments';
  }

  async saveAnswers(
    answers: Prisma.InstrumentCreateInput,
  ): Promise<Instrument> {
    const result = answers as Instrument;
    this.eventEmitter.emitAsync('instrument.created', result);
    return result;
  }
}
