import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePhotoDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly state: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly publicationId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly userId: number;
}

export class UpdatePhotoDto extends PartialType(CreatePhotoDto) {}
