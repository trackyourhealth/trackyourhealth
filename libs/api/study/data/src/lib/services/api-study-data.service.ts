import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';

import { CreateStudyDto, UpdateStudyDto } from '../data/dtos/study.dto';
import { StudyCrudService } from './study.crud.service';

@Injectable()
export class ApiStudyDataService {
  constructor(private readonly crudService: StudyCrudService) {}

  async getAll(query?: ParsedQueryModel) {
    const filter: Prisma.StudyFindManyArgs = {
      orderBy: query?.sort,
      take: query?.take,
      skip: query?.skip,
      where: {
        isActive: true,
      },
    };

    const result = await this.crudService.getAll(filter);
    return result;
  }

  async getById(id: string) {
    const result = await this.crudService.getById(id);
    return result;
  }

  async createStudy(dto: CreateStudyDto) {
    const data: Prisma.StudyCreateInput = dto;

    const result = await this.crudService.create(data);
    return result;
  }

  async updateStudy(id: string, dto: UpdateStudyDto) {
    const data = dto;

    const result = await this.crudService.update(id, data);
    return result;
  }

  async deleteStudy(id: string) {
    const result = await this.crudService.delete(id);
    return result;
  }
  async countStudies(): Promise<number | null> {
    try {
      return await this.crudService.count({ where: { isActive: true } });
    } catch (e) {
      return null;
    }
  }
}
