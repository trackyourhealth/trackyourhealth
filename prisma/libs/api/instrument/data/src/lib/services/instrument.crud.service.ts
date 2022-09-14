/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, Instrument } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class InstrumentCrudService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    filter?: Prisma.InstrumentFindManyArgs,
  ): Promise<Instrument[] | null> {
    try {
      return await this.prismaService.instrument.findMany(filter);
    } catch (e) {
      return null;
    }
  }

  async getById(id: string): Promise<Instrument | null> {
    try {
      return await this.prismaService.instrument.findUnique({
        where: { id: id },
      });
    } catch (e) {
      return null;
    }
  }

  async create(data: Prisma.InstrumentCreateInput): Promise<Instrument | null> {
    try {
      return await this.prismaService.instrument.create({ data: data });
    } catch (e) {
      return null;
    }
  }

  async update(
    id: string,
    data: Prisma.InstrumentUpdateInput,
  ): Promise<Instrument | null> {
    try {
      return await this.prismaService.instrument.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      return null;
    }
  }

  async delete(id: string): Promise<Instrument | null> {
    try {
      return await this.prismaService.instrument.delete({ where: { id: id } });
    } catch (e) {
      return null;
    }
  }

  async count(filter?: Prisma.InstrumentCountArgs): Promise<number | null> {
    try {
      return await this.prismaService.instrument.count(filter);
    } catch (e) {
      return null;
    }
  }
}
