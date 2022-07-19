import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import {
  ParsedQueryModel,
  RequestParser,
} from '@prisma-utils/nestjs-request-parser';
import { UUIDParam } from '@trackyourhealth/api/common/util';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('studies')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllStudies(
    @RequestParser() parsedOptions: ParsedQueryModel,
  ): Promise<Study[]> {
    const result = await this.apiStudyDataService.getAll(parsedOptions);
    if (result === null) {
      throw new HttpException(
        'Connection to database failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Get(':id')
  async getStudyById(@UUIDParam('id') id: string): Promise<Study> {
    const result = await this.apiStudyDataService.getById(id);
    if (result === null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post()
  async createStudy(
    @Body('study') input: Prisma.StudyCreateInput,
  ): Promise<Study> {
    const result = await this.apiStudyDataService.createStudy(input);
    if (result === null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post(':id')
  async updateStudy(
    @UUIDParam('id') id: string,
    @Body('study') input: Prisma.StudyUpdateInput,
  ): Promise<Study> {
    const result = await this.apiStudyDataService.updateStudy(id, input);
    if (result === null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':id')
  async deleteStudy(@UUIDParam('id') id: string): Promise<Study> {
    const result = await this.apiStudyDataService.deleteStudy(id);
    if (result === null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
