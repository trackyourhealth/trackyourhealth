import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';

import { StudyCrudService } from './study.crud.service';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly crudService: StudyCrudService) {}

  async getAll(parsedOptions?: ParsedQueryModel): Promise<Study[] | null> {
    const options: Prisma.StudyFindManyArgs = {
      orderBy: parsedOptions?.sort,
      take: parsedOptions?.take,
      skip: parsedOptions?.skip,
      where: {
        isActive: true,
      },
    };
    try {
      return await this.crudService.getAll(options);
    } catch (e) {
      return null;
    }
  }

  async getById(id: string): Promise<Study | null> {
    try {
      return await this.crudService.getById(id);
    } catch (e) {
      return null;
    }
  }

  async createStudy(input: Prisma.StudyCreateInput): Promise<Study | null> {
    const data = input;

    try {
      return await this.crudService.create(data);
    } catch (e: unknown) {
      return null;
    }
  }

  async updateStudy(
    id: string,
    input: Prisma.StudyUpdateInput,
  ): Promise<Study | null> {
    const data = input;

    try {
      return await this.crudService.update(id, data);
    } catch (e: unknown) {
      return null;
    }
  }

  async deleteStudy(id: string): Promise<Study | null> {
    try {
      return await this.crudService.delete(id);
    } catch (e: unknown) {
      return null;
    }
  }

  async count(): Promise<number | null> {
    try {
      return await this.crudService.count({ where: { isActive: true } });
    } catch (e) {
      return null;
    }
  }
}
