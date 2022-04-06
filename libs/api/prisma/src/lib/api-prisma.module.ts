import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  controllers: [],
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class ApiPrismaModule {}
