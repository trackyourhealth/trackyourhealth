import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ParsedQueryModel } from '@trackyourhealth/api/common/util';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllStudies(parsedOptions?: ParsedQueryModel) {
    /*
     * Unused fields:
     * ParsedQueryModel:  page
     * StudyFindManyArgs: cursor, distinct, where
     */
    const options: Prisma.StudyFindManyArgs = {
      select: parsedOptions?.select,
      orderBy: parsedOptions?.sort,
      take: parsedOptions?.take,
      skip: parsedOptions?.skip,
      where: {
        isActive: true,
      },
    };
    return this.prismaService.study.findMany(options);
  }

  async getStudyById(studyId: string): Promise<Study | null> {
    const whereId: Prisma.StudyFindUniqueArgs = {
      where: { id: studyId },
    };
    return this.prismaService.study.findUnique(whereId);
  }

  async createStudies(input: Prisma.StudyCreateInput[]): Promise<Study[]> {
    const promisedStudies: PromiseSettledResult<Study>[] =
      await Promise.allSettled(
        input.map((study) => this.prismaService.study.create({ data: study })),
      );
    return promisedStudies
      .filter((promisedStudy) => promisedStudy.status === 'fulfilled')
      .map(
        (promisedStudy) =>
          (promisedStudy as PromiseFulfilledResult<Study>).value,
      );
    /* const createdStudies = [];
    for (const createStudy of input) {
      try {
        // const result: Prisma.BatchPayload = await this.prismaService.study.createMany({ data: [input], });
        const study: Study = await this.prismaService.study.create({
          data: createStudy,
        });
        createdStudies.push(study);
      } catch (e: any) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          // uniques-constraint of variable violated
        }
        return null;
      }
    }
    return createdStudies; */
  }
}
