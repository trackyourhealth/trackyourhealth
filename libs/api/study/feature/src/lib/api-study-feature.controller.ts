import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('studies')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllStudies(): Promise<Study[]> {
    const options: Prisma.StudyFindManyArgs = {
      where: {
        isActive: true,
      },
    };
    return this.apiStudyDataService.getAllStudies(options);
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
