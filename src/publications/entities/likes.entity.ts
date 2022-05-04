import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Publication } from './publications.entity';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Publication, (publication) => publication.likes)
  @JoinColumn({ name: 'publication_id' })
  publication: Publication;
}
