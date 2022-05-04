import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Comment } from './comments.entity';
import { Like } from './likes.entity';
import { Photo } from './photos.entity';

@Entity({ name: 'publications' })
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '0 is equal to removed and 1 is equal to active',
  })
  state: number;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToMany(() => Comment, (comment) => comment.publication)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like)
  likes: Like[];

  @OneToMany(() => Photo, (photo) => photo)
  photos: Photo[];
}
