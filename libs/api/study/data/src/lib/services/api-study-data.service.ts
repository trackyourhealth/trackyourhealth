import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllStudies(options?: Prisma.StudyFindManyArgs) {
    return this.prismaService.study.findMany(options);
  }

  async getStudyById(studyId: string): Promise<Study | null> {
    const whereId: Prisma.StudyFindUniqueArgs = {
      where: { id: studyId },
    };
    return this.prismaService.study.findUnique(whereId);
  }
}
