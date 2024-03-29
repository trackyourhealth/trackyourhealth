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
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class InstrumentCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  getPrisma() {
    return this.prismaService;
  }

  async getAll(
    filter?: Prisma.InstrumentFindManyArgs,
  ): Promise<Result<PaginationInterface<Instrument>, Error>> {
    try {
      const [items, count] = await this.prismaService.$transaction([
        this.prismaService.instrument.findMany(filter),
        this.prismaService.instrument.count({ where: filter?.where }),
      ]);

      const take = filter?.take ? filter?.take : count;
      const skip = filter?.skip ? filter?.skip : 0;

      return ok({
        items: items,
        meta: {
          totalItems: count,
          items: items.length,
          totalPages: Math.ceil(count / take),
          page: skip / take + 1,
        },
      });
    } catch (e) {
      return err(
        new InternalServerErrorException(`Could not get Instrument Resources.`),
      );
    }
  }

  async getById(id: string): Promise<Result<Instrument, Error>> {
    try {
      const result = await this.prismaService.instrument.findUniqueOrThrow({
        where: { id: id },
      });
      return ok(result);
    } catch (e) {
      return err(
        new NotFoundException(`Instrument Resource ${id} was not found.`),
      );
    }
  }

  async create(
    data: Prisma.InstrumentCreateInput,
  ): Promise<Result<Instrument, Error>> {
    try {
      const result = await this.prismaService.instrument.create({ data: data });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(
          `Could not create Instrument Resource.`,
        ),
      );
    }
  }

  async update(
    id: string,
    data: Prisma.InstrumentUpdateInput,
  ): Promise<Result<Instrument, Error>> {
    try {
      const result = await this.prismaService.instrument.update({
        where: { id: id },
        data: data,
      });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(
          `Could not update Instrument Resource ${id}.`,
        ),
      );
    }
  }

  async delete(id: string): Promise<Result<Instrument, Error>> {
    try {
      const result = await this.prismaService.instrument.delete({
        where: { id: id },
      });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(
          `Could not delete Instrument Resource ${id}.`,
        ),
      );
    }
  }
}
