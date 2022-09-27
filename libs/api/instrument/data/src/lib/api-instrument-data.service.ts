import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Instrument, Prisma } from '@prisma/client';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';

import {
  CreateInstrumentDto,
  UpdateInstrumentDto,
} from './data/dtos/instrument.dto';
import { InstrumentCrudService } from './services/instrument.crud.service';

@Injectable()
export class ApiInstrumentDataService {
  constructor(
    private readonly crudService: InstrumentCrudService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAll(query: ParsedQueryModel) {
    const filter: Prisma.InstrumentFindManyArgs = {
      orderBy: query?.sort,
      take: query?.take,
      skip: query?.skip,
    };
    const result = await this.crudService.getAll(filter);
    return result;
  }

  async getById(id: string) {
    const result = await this.crudService.getById(id);
    return result;
  }

  async createInstrument(dto: CreateInstrumentDto) {
    const data: Prisma.InstrumentCreateInput = dto;

    const result = await this.crudService.create(data);
    return result;
  }

  async updateInstrument(id: string, dto: UpdateInstrumentDto) {
    const data: Prisma.InstrumentUpdateInput = dto;

    const result = await this.crudService.update(id, data);
    return result;
  }

  async deleteInstrument(id: string) {
    const result = await this.crudService.delete(id);
    return result;
  }

  async saveAnswers(
    answers: Prisma.InstrumentCreateInput,
  ): Promise<Instrument> {
    const result = answers as Instrument;
    this.eventEmitter.emitAsync('instrument.created', result);
    return result;
  }
}
