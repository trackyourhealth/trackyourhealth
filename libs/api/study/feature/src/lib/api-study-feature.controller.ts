import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Study } from '@prisma/client';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('api-study-feature')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllActiveStudies(): Promise<Study[]> {
    return this.apiStudyDataService.getAllActiveStudies();
  }

  @Get(':studyId')
  async getStudyById(@Param('studyId') studyId: string): Promise<Study> {
    const result = await this.apiStudyDataService.getStudyById(studyId);
    if (result == null) {
      throw new HttpException('No such study exists', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
