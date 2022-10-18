import { Controller, Get } from '@nestjs/common';
import {
  ParsedQueryModel,
  RequestParser,
} from '@prisma-utils/nestjs-request-parser';

@Controller('tests')
export class RequestParserTestController {
  @Get()
  index(
    @RequestParser()
    parsedRequest: ParsedQueryModel,
  ) {
    return parsedRequest;
  }
}
