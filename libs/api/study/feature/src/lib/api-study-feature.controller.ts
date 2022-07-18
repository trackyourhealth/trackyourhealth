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
} from '@trackyourhealth/api/common/util';
import { UUIDParam } from '@trackyourhealth/api/common/util';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('studies')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllStudies(
    @RequestParser() parsedOptions: ParsedQueryModel,
  ): Promise<Study[]> {
    const result = await this.apiStudyDataService.getAllStudies(parsedOptions);
    if (result == null) {
      throw new HttpException(
        'Connection to database failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Get(':studyId')
  async getStudyById(@UUIDParam('studyId') studyId: string): Promise<Study> {
    const result = await this.apiStudyDataService.getStudyById(studyId);
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get('request/count')
  async countStudies(
    @RequestParser() parsedOptions: ParsedQueryModel,
  ): Promise<number> {
    const result = await this.apiStudyDataService.countStudies(parsedOptions);
    if (result == null) {
      throw new HttpException(
        'Connection to database failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  @Post()
  async createStudy(
    @Body('study') studyInput: Prisma.StudyCreateInput,
  ): Promise<Study> {
    const result = await this.apiStudyDataService.createStudy(studyInput);
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post(':studyId')
  async updateStudy(
    @UUIDParam('studyId') studyId: string,
    @Body('study') studyInput: Prisma.StudyUpdateInput,
  ): Promise<Study> {
    const result = await this.apiStudyDataService.updateStudy(
      studyId,
      studyInput,
    );
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Delete(':studyId')
  async deleteStudy(@UUIDParam('studyId') studyId: string): Promise<Study> {
    const result = await this.apiStudyDataService.deleteStudy(studyId);
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
