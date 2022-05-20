import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/users.entity';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { clearDB } from './test.helper';
import { UsersService } from '../src/users/services/users.service';

describe('Users', () => {
  let app: INestApplication;
  let userService: UsersService;
  const initialUsers = [
    {
      name: 'Robinson',
      lastName: 'De La Cruz',
      email: 'rdelacruz@example.com',
      password: '123456789',
    },
    {
      name: 'Laura',
      lastName: 'Flórez',
      email: 'lflorez@example.com',
      password: '123456789',
    },
    {
      name: 'Santiago',
      lastName: 'De La Cruz',
      email: 'sdelacruz@example.com',
      password: '123456789',
    },
  ];

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

    for (const user of initialUsers) {
      await userService.create(user as User);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Test GET /users/:id', () => {
    it('Response with 200 success', async () => {
      await request(app.getHttpServer())
        .get(`/users/1`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    it('Bad request', async () => {
      await request(app.getHttpServer()).get(`/users/a`).expect(400);
    });

    it("Respond with 404 when an user doesn't exist", async () => {
      await request(app.getHttpServer()).get(`/users/100`).expect(404);
    });
  });

  describe('Test GET /users', () => {
    it('Response with 200 success', async () => {
      await request(app.getHttpServer())
        .get(`/users`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    it('There are three users', async () => {
      const response = await request(app.getHttpServer()).get(`/users`);
      expect(response.body).toHaveLength(initialUsers.length);
    });
  });

  describe('Test POST /users', () => {
    it("It's possible with a valid user", async () => {
      const newUser = {
        name: 'Robinson',
        lastName: 'De La Cruz',
        email: 'asiado@example.com',
        password: 'test',
      } as User;

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const users = await userService.findAll();
      expect(users).toHaveLength(initialUsers.length + 1);
      expect(users.map(({ name }) => name)).toContain(newUser.name);
    });

    it("It's not possible with an invalid user", async () => {
      const newUser = {
        name: '',
        lastName: 'Siado',
        email: 'asiado@example.com',
        password: '123456789',
      } as User;

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(400);
      const users = await userService.findAll();
      expect(users).toHaveLength(initialUsers.length);
    });
  });

  describe('Test PUT /users', () => {
    it("It's possible with a valid user", async () => {
      const user = {
        name: 'Leandro',
        lastName: 'Martinez',
        email: 'rdelacruz@example.com',
        password: 'demo',
      } as User;

      await request(app.getHttpServer())
        .put('/users/1')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const users = await userService.findAll();
      expect(users.map(({ name }) => name)).toContain(user.name);
    });

    it("It's not possible with an invalid user", async () => {
      const userId = 1;
      const userToChange = {
        name: '',
        lastName: 'Siado',
        email: 'r@example.com',
        password: 'demo',
      } as User;
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(userToChange)
        .expect(400);

      const user = await userService.findOne(userId);
      expect(user).not.toMatchObject(userToChange);
    });

    it("Respond with 404 when an user doesn't exist", async () => {
      const userId = 100;
      const userToChange = {
        name: 'Marta',
        lastName: 'Siado',
        email: 'marta@example.com',
        password: 'test',
      } as User;
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(userToChange)
        .expect(404);
    });
  });

  describe('Test DELETE /users', () => {
    it('Delete a user with a valid ID', async () => {
      const userId = 1;
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);
    });

    it("Respond with 404 when an user doesn't exist", async () => {
      const userId = 100;
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(404);
    });

    it('Respond with 400 when the id is invalid', async () => {
      const userId = 'a';
      await request(app.getHttpServer()).delete(`/users/${userId}`).expect(400);
    });
  });
});
