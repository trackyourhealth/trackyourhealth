import { Body, Controller, Get, Post } from '@nestjs/common';
import { Instrument, Prisma } from '@prisma/client';
import { ApiInstrumentDataService } from '@trackyourhealth/api/instrument/data';

@Controller('instruments')
export class ApiInstrumentFeatureController {
  constructor(
    private readonly apiInstrumentDataService: ApiInstrumentDataService,
  ) {}

  @Get()
  async getAllInstruments(): Promise<string> {
    return await this.apiInstrumentDataService.getAllInstruments();
  }

  @Post()
  async saveAnswers(
    @Body('answers') answers: Prisma.InstrumentCreateInput,
  ): Promise<Instrument> {
    return this.apiInstrumentDataService.saveAnswers(answers);
  }
}
