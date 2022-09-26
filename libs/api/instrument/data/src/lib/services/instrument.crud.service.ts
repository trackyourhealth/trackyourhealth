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
import { Instrument, Prisma } from '@prisma/client';
import {
  PaginationInterface,
  PrismaService,
} from '@prisma-utils/nestjs-prisma';

@Injectable()
export class InstrumentCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  getPrisma() {
    return this.prismaService;
  }

  async getAll(
    filter?: Prisma.InstrumentFindManyArgs,
  ): Promise<PaginationInterface<Instrument>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.instrument.findMany(filter),
      this.prismaService.instrument.count({ where: filter?.where }),
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

  async getById(id: string): Promise<Instrument> {
    try {
      const result = await this.prismaService.instrument.findUniqueOrThrow({
        where: { id: id },
      });
      return result;
    } catch (e) {
      throw new NotFoundException(`Instrument Resource ${id} was not found.`);
    }
  }

  async create(data: Prisma.InstrumentCreateInput): Promise<Instrument> {
    try {
      const result = await this.prismaService.instrument.create({ data: data });
      return result;
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not create Instrument Resource`,
      );
    }
  }

  async update(
    id: string,
    data: Prisma.InstrumentUpdateInput,
  ): Promise<Instrument> {
    try {
      return await this.prismaService.instrument.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not update Instrument Resource ${id}`,
      );
    }
  }

  async delete(id: string): Promise<Instrument> {
    try {
      return await this.prismaService.instrument.delete({ where: { id: id } });
    } catch (e) {
      throw new InternalServerErrorException(
        `Could not delete Instrument Model ${id}`,
      );
    }
  }
}
