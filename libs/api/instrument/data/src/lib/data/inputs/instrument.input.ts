/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class InstrumentInput {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  title!: object;

  @ApiProperty()
  description!: object;

  @ApiProperty()
  questionnaire!: object;

  @ApiProperty()
  evaluator!: object;
}

export class CreateInstrumentInput extends OmitType(InstrumentInput, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateInstrumentInput extends PartialType(CreateInstrumentInput) {}
