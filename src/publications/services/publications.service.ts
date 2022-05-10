import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Publication } from '../entities/publications.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from '../dtos/publications.dto';
import { UsersService } from 'src/users/services/users.service';
import { Photo } from '../entities/photos.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationRepo: Repository<Publication>,
    @InjectRepository(Photo) private photoRepo: Repository<Photo>,
    private usersService: UsersService,
  ) {}

  async findAll() {
    return await this.publicationRepo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const publication = await this.publicationRepo.findOne(id);
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
    for (const photo of data.photos) {
      photo.publication = newPublication;
      photo.user = user;
      const newPhoto = this.photoRepo.create(photo);
      await this.photoRepo.save(newPhoto);
    }
    return newPublication;
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