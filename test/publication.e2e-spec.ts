import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/users.entity';
import { clearDB } from './test.helper';
import { UsersService } from '../src/users/services/users.service';
import { ApiKeyGuard } from '../src/auth/guards/api-key.guard';
import { PublicationsService } from '../src/publications/services/publications.service';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from '../src/publications/dtos/publications.dto';

describe('Publications', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let publicationsService: PublicationsService;
  const file = `${__dirname}/test_files/publication_photo_1.png`;
  const user = {
    name: 'Robinson',
    lastName: 'De La Cruz',
    email: 'rdelacruz@example.com',
    password: '123456789',
  } as User;
  const initialPublications = [
    { description: 'New publication', userId: 1 },
    { description: 'New publication', userId: 1 },
  ] as CreatePublicationDto[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({
        canActive: () => {
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersService = moduleFixture.get<UsersService>(UsersService);
    publicationsService =
      moduleFixture.get<PublicationsService>(PublicationsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await usersService.create(user);
    for (const publication of initialPublications) {
      await publicationsService.create(publication);
    }
  });

  afterEach(async () => {
    await clearDB();
  });

  describe('Test GET /publications/:id', () => {
    it('Response with 200 success', async () => {
      await request(app.getHttpServer())
        .get(`/publications/1`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    it('Bad request', async () => {
      await request(app.getHttpServer()).get(`/publications/a`).expect(400);
    });

    it("Respond with 404 when a publication doesn't exist", async () => {
      await request(app.getHttpServer()).get(`/publications/100`).expect(404);
    });
  });

  describe('Test GET /publications', () => {
    it('Response with 200 success', async () => {
      await request(app.getHttpServer())
        .get(`/publications`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    it('There are three publications', async () => {
      const response = await request(app.getHttpServer()).get(`/publications`);
      expect(response.body).toHaveLength(initialPublications.length);
    });
  });

  describe('Test POST /publications', () => {
    it("It's possible with a valid publication", async () => {
      await request(app.getHttpServer())
        .post('/publications')
        .send({ description: 'New publication', userId: 1 })
        .expect(201);
    });

    it("It's not possible with an invalid publication", async () => {
      await request(app.getHttpServer())
        .post('/publications')
        .field('description', 'New publication')
        .field('userId', 1)
        .expect(400);
    });

    it('Upload photos', async () => {
      await request(app.getHttpServer())
        .post('/publications/upload-photos')
        .attach('photos', file)
        .attach('photos', file)
        .field('userId', 1)
        .field('publicationId', 1)
        .expect(201);
    });

    it('Upload photos without a user', async () => {
      await request(app.getHttpServer())
        .post('/publications/upload-photos')
        .attach('photos', file)
        .field('publicationId', 1)
        .expect(400);
    });
  });

  describe('Test PUT /publications', () => {
    it('Update description of a publication', async () => {
      const publicationChanges = {
        description: 'Description updated',
      } as UpdatePublicationDto;
      await request(app.getHttpServer())
        .put('/publications/1')
        .send(publicationChanges)
        .expect(200);
      const publication = await publicationsService.findOne(1);
      expect(publication.description).toEqual(publicationChanges.description);
      expect(publication.createdAt).not.toEqual(publication.updateAt);
    });

    it('Publication not found', async () => {
      await request(app.getHttpServer())
        .put('/publications/100')
        .send({})
        .expect(404);
    });

    it('Publication without id', async () => {
      await request(app.getHttpServer()).put('/publications').expect(404);
    });
  });

  describe('Test DELETE /publications', () => {
    it('Delete publication successfully', async () => {
      await request(app.getHttpServer()).delete('/publications/1').expect(200);
      const publications = await publicationsService.findAll();
      expect(publications).toHaveLength(initialPublications.length - 1);
    });

    it('Publication not found', async () => {
      await request(app.getHttpServer())
        .delete('/publications/100')
        .expect(404);
    });

    it("It's not possible without an ID", async () => {
      await request(app.getHttpServer()).delete('/publications').expect(404);
    });
  });
});
