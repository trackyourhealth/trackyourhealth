import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { Instrument } from '@prisma/client';
import { PaginationInterface } from '@prisma-utils/nestjs-prisma';
import {
  ParsedQueryModel,
  RequestParser,
} from '@prisma-utils/nestjs-request-parser';
import { Endpoint, UUIDParam } from '@trackyourhealth/api/common/util';
import {
  ApiInstrumentDataService,
  CreateInstrumentDto,
  CreateInstrumentInput,
  UpdateInstrumentDto,
  UpdateInstrumentInput,
} from '@trackyourhealth/api/instrument/data';
import { Result } from 'neverthrow';

import {
  CreateInstrumentRequest,
  UpdateInstrumentRequest,
} from '../data/requests';

@Controller('studies/:studyId/instruments')
export class ApiInstrumentFeatureController {
  constructor(
    private readonly apiInstrumentDataService: ApiInstrumentDataService,
  ) {}

  @Endpoint({
    meta: {
      summary: 'Get Instruments',
      description:
        'Returns all `Instrument` items that match specific filter conditions',
    },
    request: {
      addPaginationQueryParams: true,
      addSortQueryParams: true,
    },
  })
  @Get()
  async getAllInstruments(
    @RequestParser() parsedOptions: ParsedQueryModel,
  ): Promise<Result<PaginationInterface<Instrument>, Error>> {
    const result = await this.apiInstrumentDataService.getAll(parsedOptions);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Get Instrument',
      description: 'Returns one `Instrument` by ID',
    },
    request: {},
  })
  @Get(':id')
  async getInstrumentById(
    @UUIDParam('id') id: string,
  ): Promise<Result<Instrument, Error>> {
    const result = await this.apiInstrumentDataService.getById(id);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Create new Instrument',
      description: 'Creates a new `Instrument`',
    },
    request: {
      model: CreateInstrumentInput,
    },
    response: {
      status: HttpStatus.CREATED,
    },
  })
  @Post()
  async createInstrument(
    @Body() input: CreateInstrumentRequest,
    @UUIDParam('studyId') studyId: string,
  ): Promise<Result<Instrument, Error>> {
    const dto: CreateInstrumentDto = {
      name: input.data.name,
      title: input.data.title,
      description: input.data.description,
      content: input.data.content,
      evaluations: input.data.evaluations,
      schedule: input.data.schedule,
    };

    const result = await this.apiInstrumentDataService.createInstrument(
      dto,
      studyId,
    );
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Update Instrument',
      description: 'Update an existing `Instrument` by ID',
    },
    request: {
      model: UpdateInstrumentInput,
    },
  })
  @Patch(':id')
  async updateInstrument(
    @UUIDParam('id') id: string,
    @Body() input: UpdateInstrumentRequest,
  ): Promise<Result<Instrument, Error>> {
    const dto: UpdateInstrumentDto = {
      name: input.data.name,
      title: input.data.title,
      description: input.data.description,
      content: input.data.content,
      evaluations: input.data.evaluations,
    };

    const result = await this.apiInstrumentDataService.updateInstrument(
      id,
      dto,
    );
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Delete Instrument',
      description: 'Delete a `Instrument` by ID',
    },
    response: {
      status: HttpStatus.NO_CONTENT,
    },
  })
  @Delete(':id')
  async deleteInstrument(@UUIDParam('id') id: string): Promise<void> {
    await this.apiInstrumentDataService.deleteInstrument(id);
    return;
  }
}
