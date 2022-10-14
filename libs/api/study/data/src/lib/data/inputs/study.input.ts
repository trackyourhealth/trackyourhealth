/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsDate } from 'class-validator';
import { IsObject } from 'class-validator';
import { IsBoolean } from 'class-validator';
import { IsISO8601 } from 'class-validator';
import { IsOptional } from 'class-validator';

export class StudyInput {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;

  @ApiProperty()
  @IsString()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsObject()
  @IsObject()
  title!: object;

  @ApiProperty()
  @IsObject()
  @IsObject()
  description!: object;

  @ApiProperty()
  @IsBoolean()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty()
  @IsDate()
  @IsISO8601()
  startsAt!: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @IsISO8601()
  endsAt?: Date;
}

export class CreateStudyInput extends OmitType(StudyInput, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateStudyInput extends PartialType(CreateStudyInput) {}
