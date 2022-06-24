import { Controller, Get } from '@nestjs/common';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';

@Controller('api-study-feature')
export class ApiStudyFeatureController {
  constructor(private readonly apiStudyDataService: ApiStudyDataService) {}

  @Get()
  async getAllActiveStudies() {
    return await this.apiStudyDataService.getAllActiveStudies();
  }
}
