import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ParsedQueryModel } from '@trackyourhealth/api/common/util';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllStudies(
    parsedOptions?: ParsedQueryModel,
  ): Promise<Study[] | null> {
    /*
     * Unused fields:
     * ParsedQueryModel:  page
     * StudyFindManyArgs: cursor, distinct, where
     */
    const options: Prisma.StudyFindManyArgs = {
      //select: select,
      orderBy: parsedOptions?.sort,
      take: parsedOptions?.take,
      skip: parsedOptions?.skip,
      where: {
        isActive: true,
      },
    };
    try {
      return await this.prismaService.study.findMany(options);
    } catch (e) {
      return null;
    }
  }

  async getStudyById(studyId: string): Promise<Study | null> {
    const whereId: Prisma.StudyFindUniqueArgs = {
      where: { id: studyId },
    };
    try {
      return await this.prismaService.study.findUnique(whereId);
    } catch (e) {
      return null;
    }
  }

  async createStudy(input: Prisma.StudyCreateInput): Promise<Study | null> {
    try {
      return await this.prismaService.study.create({ data: input });
    } catch (e: unknown) {
      return null;
    }
  }

  async updateStudy(
    studyId: string,
    data: Prisma.StudyUpdateInput,
  ): Promise<Study | null> {
    const options = {
      data: data,
      where: {
        id: studyId,
      },
    };
    try {
      return await this.prismaService.study.update(options);
    } catch (e: unknown) {
      return null;
    }
  }

  async deleteStudy(studyId: string): Promise<Study | null> {
    const options = {
      where: {
        id: studyId,
      },
    };
    try {
      return await this.prismaService.study.delete(options);
    } catch (e: unknown) {
      return null;
    }
  }
}
