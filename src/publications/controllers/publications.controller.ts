import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { PublicationsService } from '../services/publications.service';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from '../dtos/publications.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('publications')
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Get()
  @Public()
  async findAll() {
    return await this.publicationsService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.publicationsService.findOne(id);
  }

  @Post()
  async create(@Body() payload: CreatePublicationDto) {
    return await this.publicationsService.create(payload);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePublicationDto,
  ) {
    return await this.publicationsService.update(id, payload);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.publicationsService.remove(id);
  }
}
