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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.publicationsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 20, {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  async create(
    @Body() payload: CreatePublicationDto,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    return await this.publicationsService.create(payload, photos);
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
