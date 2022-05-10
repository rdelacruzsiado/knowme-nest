import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Photo } from '../entities/photos.entity';
import { Type } from 'class-transformer';
import { CreatePhotoDto } from './photos.dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePhotoDto)
  @ArrayNotEmpty()
  @ApiProperty()
  readonly photos: Photo[];
}

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
