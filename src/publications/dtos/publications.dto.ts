import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly state: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: number;
}

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
