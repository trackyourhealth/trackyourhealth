/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class StudyCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(filter?: Prisma.StudyFindManyArgs): Promise<Study[] | null> {
    try {
      return await this.prismaService.study.findMany(filter);
    } catch (e) {
      return null;
    }
  }

  async getById(id: string): Promise<Study | null> {
    try {
      return await this.prismaService.study.findUnique({ where: { id: id } });
    } catch (e) {
      return null;
    }
  }

  async create(data: Prisma.StudyCreateInput): Promise<Study | null> {
    try {
      return await this.prismaService.study.create({ data: data });
    } catch (e) {
      return null;
    }
  }

  async update(
    id: string,
    data: Prisma.StudyUpdateInput,
  ): Promise<Study | null> {
    try {
      return await this.prismaService.study.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      return null;
    }
  }

  async delete(id: string): Promise<Study | null> {
    try {
      return await this.prismaService.study.delete({ where: { id: id } });
    } catch (e) {
      return null;
    }
  }

  async count(filter?: Prisma.StudyCountArgs): Promise<number | null> {
    try {
      return await this.prismaService.study.count(filter);
    } catch (e) {
      return null;
    }
  }
}
