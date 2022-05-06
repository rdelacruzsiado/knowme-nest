import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll() {
    return this.userRepo.find({ where: { state: 1 } });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, { state: 0 });
    return this.userRepo.save(user);
  }
}
