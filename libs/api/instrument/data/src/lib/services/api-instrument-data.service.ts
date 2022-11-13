import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';

import {
  CreateInstrumentDto,
  UpdateInstrumentDto,
} from '../data/dtos/instrument.dto';
import { createStateMachine } from '../data/fsm/instrument.machine';
import { InstrumentCrudService } from './instrument.crud.service';

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

  async createInstrument(dto: CreateInstrumentDto, studyId: string) {
    const data: Prisma.InstrumentCreateInput = {
      ...dto,
      state: createStateMachine().serialize(),
      study: { connect: { id: studyId } },
    };

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
}
