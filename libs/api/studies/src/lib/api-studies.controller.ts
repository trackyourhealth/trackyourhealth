import { Controller, Get } from '@nestjs/common';

import { ApiStudiesService } from './api-studies.service';

@Controller('studies')
export class ApiStudiesController {
  constructor(private apiStudiesService: ApiStudiesService) {}

  @Get()
  async getStudies() {
    // do nothing
  }
}
