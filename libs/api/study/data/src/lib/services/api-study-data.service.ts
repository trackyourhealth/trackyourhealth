import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllActiveStudies(): Promise<Study[]> {
    const whereActive: Prisma.StudyFindManyArgs = {
      where: { isActive: true },
    };
    return await this.prismaService.study.findMany(whereActive);
  }
}
