import { Body, Controller, Post } from '@nestjs/common';
import { OmitType, PartialType } from '@nestjs/swagger';
import { GenerateDataRequest } from '@trackyourhealth/api/core/util';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

class TestInput {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsNumber()
  foo?: number;
}

class CreateTestInput extends OmitType(TestInput, ['id'] as const) {}

class UpdateTestInput extends PartialType(CreateTestInput) {}

class CreateTestRequest extends GenerateDataRequest(CreateTestInput) {}
class UpdateTestRequest extends GenerateDataRequest(UpdateTestInput) {}

@Controller('tests')
export class ValidationTestController {
  @Post()
  postData(@Body() input: CreateTestRequest) {
    return 'ok';
  }
}
