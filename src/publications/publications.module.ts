import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comments.entity';
import { Like } from './entities/likes.entity';
import { Photo } from './entities/photos.entity';
import { Publication } from './entities/publications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Comment, Like, Photo])],
})
export class PublicationsModule {}
