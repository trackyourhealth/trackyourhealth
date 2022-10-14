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
import { IsObject } from 'class-validator';
import { IsBoolean } from 'class-validator';
import { IsOptional } from 'class-validator';

export class StudyInput {
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
  @IsString()
  name!: string;

  @ApiProperty()
  @IsObject()
  title!: object;

  @ApiProperty()
  @IsObject()
  description!: object;

  @ApiProperty()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty()
  @IsISO8601()
  startsAt!: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  endsAt?: Date;
}

export class CreateStudyInput extends OmitType(StudyInput, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateStudyInput extends PartialType(CreateStudyInput) {}
