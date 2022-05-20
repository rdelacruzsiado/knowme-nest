import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly phone: string;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly birthday: Date;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly photo: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly state: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
