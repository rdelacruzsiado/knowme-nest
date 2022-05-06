import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  readonly phone: string;

  @IsDate()
  @IsOptional()
  readonly birthday: Date;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly photo: string;

  @IsNumber()
  @IsOptional()
  readonly state: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
