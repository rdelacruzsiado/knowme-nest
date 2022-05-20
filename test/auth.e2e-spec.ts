import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/users.entity';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { clearDB } from './test.helper';
import { UsersService } from '../src/users/services/users.service';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;
  const userTest = {
    name: 'Robinson',
    lastName: 'De La Cruz',
    email: 'rdelacruz@example.com',
    password: 'test',
  } as User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActive: () => {
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userService = moduleFixture.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    await clearDB();
    await userService.create(userTest);
  });

  it('handles a login request', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userTest.email, password: userTest.password } as User)
      .expect(201)
      .then((res) => {
        const { access_token, user } = res.body;
        expect(access_token).toBeDefined();
        expect(user.email).toEqual(userTest.email);
      });
  });

  afterAll(async () => {
    await clearDB();
    await app.close();
  });
});
