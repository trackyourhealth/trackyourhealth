/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

    return {
      items: items,
      meta: {
        totalItems: count,
        items: items.length,
        totalPages: Math.ceil(count / filter?.take),
        page: filter?.skip / filter?.take + 1,
      },
    };
  }

  async getById(id: string): Promise<Study | null> {
    const result = await this.prismaService.study.findUnique({
      where: { id: id },
    });
    return result;
  }

  async create(data: Prisma.StudyCreateInput): Promise<Study> {
    try {
      const result = await this.prismaService.study.create({ data: data });
      return result;
    } catch (e) {
      throw new InternalServerErrorException(`Could not create Study Model`);
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
        `Could not update Study Model ${id}`,
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
