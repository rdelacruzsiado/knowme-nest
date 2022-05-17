import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/users.entity';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { getConnection } from 'typeorm';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;
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
  });

  it('handles a login request', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(userTest)
      .expect(201);
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
    const entities = getConnection().entityMetadatas;
    for (const entity of entities) {
      const repository = getConnection().getRepository(entity.name);
      await repository.query(
        `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
      );
    }
    await app.close();
  });
});
