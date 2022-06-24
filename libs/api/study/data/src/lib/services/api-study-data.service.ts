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
    return this.prismaService.study.findMany(whereActive);
  }

  async getStudyById(studyId: string): Promise<Study | null> {
    if (!studyId) {
      return null;
    }
    const whereId: Prisma.StudyFindUniqueArgs = {
      where: { id: studyId },
    };
    return this.prismaService.study.findUnique(whereId);
  }
}
