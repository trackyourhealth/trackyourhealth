import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoreRequest } from '@trackyourhealth/api/core/util';

export class RegisterRequest extends CoreRequest {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: 'string', format: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
