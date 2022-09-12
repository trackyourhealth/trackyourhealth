/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import {
  PaginationInterface,
  PrismaService,
} from '@prisma-utils/nestjs-prisma';

@Injectable()
export class StudyCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  getPrisma() {
    return this.prismaService;
  }

  async getAll(
    filter?: Prisma.StudyFindManyArgs,
  ): Promise<PaginationInterface<Study>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.study.findMany(filter),
      this.prismaService.study.count({ where: filter?.where }),
    ]);

    const take = filter?.take ? filter?.take : count;
    const skip = filter?.skip ? filter?.skip : 0;

    return {
      items: items,
      meta: {
        totalItems: count,
        items: items.length,
        totalPages: Math.ceil(count / take),
        page: skip / take + 1,
      },
    };
  }

  async getById(id: string): Promise<Study> {
    try {
      const result = await this.prismaService.study.findUniqueOrThrow({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new NotFoundException(`Study Resource ${id} was not found.`);
    }
  }

  async create(data: Prisma.StudyCreateInput): Promise<Study> {
    try {
      const result = await this.prismaService.study.create({ data: data });
      return result;
    } catch (e) {
      throw new InternalServerErrorException(`Could not create Study Resource`);
    }
  }

  async update(id: string, data: Prisma.StudyUpdateInput): Promise<Study> {
    try {
      return await this.prismaService.study.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not update Study Resource ${id}`,
      );
    }
  }

  async delete(id: string): Promise<Study> {
    try {
      return await this.prismaService.study.delete({ where: { id: id } });
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not delete Study Model ${id}`,
      );
    }
  }
}
