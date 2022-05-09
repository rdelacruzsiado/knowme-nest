import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from './entities/comments.entity';
import { Like } from './entities/likes.entity';
import { Photo } from './entities/photos.entity';
import { Publication } from './entities/publications.entity';
import { PublicationsController } from './controllers/publications.controller';
import { PublicationsService } from './services/publications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Comment, Like, Photo]),
    UsersModule,
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
