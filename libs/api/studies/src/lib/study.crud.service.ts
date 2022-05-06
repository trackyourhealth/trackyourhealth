/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

const defaultPaginationOptions = {
  take: 20,
  skip: 0,
};

@Injectable()
export class StudyCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  async aggregate(data: Prisma.StudyAggregateArgs) {
    try {
      const result = await this.prismaService.study.aggregate(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async count(data: Prisma.StudyCountArgs) {
    try {
      const result = await this.prismaService.study.count(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async create(data: Prisma.StudyCreateArgs) {
    try {
      const result = await this.prismaService.study.create(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async delete(data: Prisma.StudyDeleteArgs) {
    try {
      const result = await this.prismaService.study.delete(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async deleteMany(data: Prisma.StudyDeleteManyArgs) {
    try {
      const result = await this.prismaService.study.deleteMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findFirst(data: Prisma.StudyFindFirstArgs) {
    try {
      const result = await this.prismaService.study.findFirst(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findMany(data: Prisma.StudyFindManyArgs) {
    try {
      const result = await this.prismaService.study.findMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findUnique(data: Prisma.StudyFindUniqueArgs) {
    try {
      const result = await this.prismaService.study.findUnique(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async paginate(data: Prisma.StudyFindManyArgs) {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.study.findMany(data),
      this.prismaService.study.count({ where: data.where }),
    ]);

    data.take = data.take || defaultPaginationOptions.take;
    data.skip = data.skip || defaultPaginationOptions.skip;

    return {
      data: items,
      meta: {
        totalCount: count,
        count: items.length,
        totalPages: Math.ceil(count / data.take),
        page: data.skip / data.take + 1,
      },
    };
  }

  async update(data: Prisma.StudyUpdateArgs) {
    try {
      const result = await this.prismaService.study.update(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async updateMany(data: Prisma.StudyUpdateManyArgs) {
    try {
      const result = await this.prismaService.study.updateMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async upsert(data: Prisma.StudyUpsertArgs) {
    try {
      const result = await this.prismaService.study.upsert(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}
