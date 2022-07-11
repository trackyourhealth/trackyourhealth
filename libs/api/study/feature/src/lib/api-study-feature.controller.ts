import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import {
  ParsedQueryModel,
  RequestParser,
} from '@trackyourhealth/api/common/util';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('studies')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllStudies(
    @RequestParser() parsedOptions: ParsedQueryModel,
  ): Promise<Study[]> {
    return this.apiStudyDataService.getAllStudies(parsedOptions);
  }

  @Get(':studyId')
  async getStudyById(@Param('studyId') studyId: string): Promise<Study> {
    const result = await this.apiStudyDataService.getStudyById(studyId);
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Post()
  async createStudy(
    @Body('studies') studyInput: Prisma.StudyCreateInput[],
  ): Promise<Study[]> {
    return this.apiStudyDataService.createStudies(studyInput);
  }
}
