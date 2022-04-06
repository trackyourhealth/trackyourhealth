/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

const defaultPaginationOptions = {
  take: 20,
  skip: 0,
};

@Injectable()
export class StudyCrudService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async aggregate(data: Prisma.StudyAggregateArgs) {
    try {
      const result = await this.prismaClient.study.aggregate(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async count(data: Prisma.StudyCountArgs) {
    try {
      const result = await this.prismaClient.study.count(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async create(data: Prisma.StudyCreateArgs) {
    try {
      const result = await this.prismaClient.study.create(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async delete(data: Prisma.StudyDeleteArgs) {
    try {
      const result = await this.prismaClient.study.delete(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async deleteMany(data: Prisma.StudyDeleteManyArgs) {
    try {
      const result = await this.prismaClient.study.deleteMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findFirst(data: Prisma.StudyFindFirstArgs) {
    try {
      const result = await this.prismaClient.study.findFirst(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findMany(data: Prisma.StudyFindManyArgs) {
    try {
      const result = await this.prismaClient.study.findMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findUnique(data: Prisma.StudyFindUniqueArgs) {
    try {
      const result = await this.prismaClient.study.findUnique(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async paginate(data: Prisma.StudyFindManyArgs) {
    const [items, count] = await this.prismaClient.$transaction([
      this.prismaClient.study.findMany(data),
      this.prismaClient.study.count({ where: data.where }),
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
      const result = await this.prismaClient.study.update(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async updateMany(data: Prisma.StudyUpdateManyArgs) {
    try {
      const result = await this.prismaClient.study.updateMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async upsert(data: Prisma.StudyUpsertArgs) {
    try {
      const result = await this.prismaClient.study.upsert(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}
