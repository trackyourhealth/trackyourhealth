import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ParsedQueryModel,
  RequestParser,
} from '@prisma-utils/nestjs-request-parser';
import { Endpoint, UUIDParam } from '@trackyourhealth/api/common/util';
import {
  ApiStudyDataService,
  CreateStudyDto,
  CreateStudyInput,
  UpdateStudyDto,
  UpdateStudyInput,
} from '@trackyourhealth/api/study/data';

import { CreateStudyRequest, UpdateStudyRequest } from '../data/requests';

@Controller('studies')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Endpoint({
    meta: {
      summary: 'Get Studies',
      description:
        'Returns all `Study` items that match specific filter conditions',
    },
    request: {
      addPaginationQueryParams: true,
      addSortQueryParams: true,
    },
  })
  @Get()
  async getAllStudies(@RequestParser() parsedOptions: ParsedQueryModel) {
    const result = await this.apiStudyDataService.getAll(parsedOptions);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Get Study',
      description: 'Returns one `Study` by ID',
    },
  })
  @Get(':id')
  async getStudyById(@UUIDParam('id') id: string) {
    const result = await this.apiStudyDataService.getById(id);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Create new Study',
      description: 'Creates a new `Study`',
    },
    request: {
      model: CreateStudyInput,
    },
    response: {
      status: HttpStatus.CREATED,
    },
  })
  @Post()
  async createStudy(@Body() input: CreateStudyRequest) {
    const dto: CreateStudyDto = {
      name: input.data.name,
      title: input.data.title,
      description: input.data.description,
      isActive: input.data.isActive,
      startsAt: new Date(input.data.startsAt),
      endsAt: input.data.endsAt ? new Date(input.data.endsAt) : undefined,
    };

    const result = await this.apiStudyDataService.createStudy(dto);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Update Study',
      description: 'Update an existing `Study` by ID',
    },
    request: {
      model: UpdateStudyInput,
    },
  })
  @Patch(':id')
  async updateStudy(
    @UUIDParam('id') id: string,
    @Body() input: UpdateStudyRequest,
  ) {
    const dto: UpdateStudyDto = {
      name: input.data.name,
      title: input.data.title,
      description: input.data.description,
      isActive: input.data.isActive,
      startsAt: input.data.startsAt ? new Date(input.data.startsAt) : undefined,
      endsAt: input.data.endsAt ? new Date(input.data.endsAt) : undefined,
    };

    const result = await this.apiStudyDataService.updateStudy(id, dto);
    return result;
  }

  @Endpoint({
    meta: {
      summary: 'Delete Study',
      description: 'Delete a `Study` by ID',
    },
    response: {
      status: HttpStatus.NO_CONTENT,
    },
  })
  @Delete(':id')
  async deleteStudy(@UUIDParam('id') id: string): Promise<void> {
    await this.apiStudyDataService.deleteStudy(id);
    return;
  }
}
