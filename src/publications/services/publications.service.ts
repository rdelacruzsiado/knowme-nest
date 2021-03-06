import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Publication } from '../entities/publications.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from '../dtos/publications.dto';
import { CreatePhotoDto } from '../dtos/photos.dto';
import { Photo } from '../entities/photos.entity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationRepo: Repository<Publication>,
    @InjectRepository(Photo) private photoRepo: Repository<Photo>,
    private usersService: UsersService,
  ) {}

  async findAll() {
    return await this.publicationRepo.find({
      relations: ['user'],
      where: { state: 1 },
    });
  }

  async findOne(id: number) {
    const publication = await this.publicationRepo.findOne(id, {
      relations: ['user', 'photos', 'likes', 'comments'],
      where: { state: 1 },
    });
    if (!publication) {
      throw new NotFoundException(`Publication #${id} not found.`);
    }
    return publication;
  }

  async create(data: CreatePublicationDto) {
    const newPublication = this.publicationRepo.create(data);
    const user = await this.usersService.findOne(data.userId);
    newPublication.user = user;
    await this.publicationRepo.save(newPublication);
    return newPublication;
  }

  async uploadPhotos(data: CreatePhotoDto, photos: Array<Express.Multer.File>) {
    if (photos.length === 0) {
      throw new BadRequestException('Photos should not be empty');
    }

    const publication = await this.publicationRepo.findOne(data.publicationId);
    const user = await this.usersService.findOne(data.userId);

    for (const file of photos) {
      const photo = { route: file.path } as Photo;
      photo.publication = publication;
      photo.user = user;
      const newPhoto = this.photoRepo.create(photo);
      await this.photoRepo.save(newPhoto);
    }

    return true;
  }

  async update(id: number, changes: UpdatePublicationDto) {
    const publication = await this.findOne(id);
    if (changes.userId) {
      const newUser = await this.usersService.findOne(changes.userId);
      publication.user = newUser;
    }
    this.publicationRepo.merge(publication, changes);
    return await this.publicationRepo.save(publication);
  }

  async remove(id: number) {
    return await this.update(id, { state: 0 });
  }
}
