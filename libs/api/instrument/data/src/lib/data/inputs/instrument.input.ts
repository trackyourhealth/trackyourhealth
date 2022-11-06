/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsISO8601 } from 'class-validator';
import { IsDefined } from 'class-validator';
import { IsObject } from 'class-validator';

export class InstrumentInput {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsISO8601()
  createdAt!: Date;

  @ApiProperty()
  @IsISO8601()
  updatedAt!: Date;

  @ApiProperty()
  @IsDefined()
  study!: unknown;

  @ApiProperty()
  @IsString()
  studyId!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsObject()
  title!: object;

  @ApiProperty()
  @IsObject()
  description!: object;

  @ApiProperty()
  @IsObject()
  content!: object;

  @ApiProperty()
  @IsObject()
  evaluations!: object;

  @ApiProperty()
  @IsObject()
  state!: object;

  @ApiProperty()
  @IsObject()
  schedule!: object;
}

export class CreateInstrumentInput extends OmitType(InstrumentInput, [
  'id',
  'createdAt',
  'updatedAt',
  'study',
  'studyId',
] as const) {}

export class UpdateInstrumentInput extends PartialType(CreateInstrumentInput) {}
