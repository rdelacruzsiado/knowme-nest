import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly route: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly state: number;
}

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {}
