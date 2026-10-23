import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('Reports HTTP', () => {
  let app: INestApplication;
  const create = jest
    .fn()
    .mockImplementation(async (dto, photo) => ({
      ...dto,
      photoUrl: 'https://example.com/reports/photo.png',
      repairPhotoUrl: null,
    }));
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            create,
            findAll: async () => [
              {
                photoUrl: 'https://example.com/reports/photo.png',
                repairPhotoUrl: null,
              },
            ],
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  it('rejects missing photo with HTTP 400', () =>
    request(app.getHttpServer())
      .post('/reports')
      .field('address', 'Calle 1')
      .field('description', 'Fuga')
      .field('severity', 'high')
      .field('reporterPhone', '123')
      .expect(400));
  it('accepts multipart fields and photo', async () => {
    const response = await request(app.getHttpServer())
      .post('/reports')
      .field('address', 'Calle 1')
      .field('description', 'Fuga')
      .field('severity', 'high')
      .field('reporterPhone', '123')
      .attach('photo', Buffer.from('photo'), {
        filename: 'photo.png',
        contentType: 'image/png',
      })
      .expect(201);
    expect(response.body.photoUrl).toBeDefined();
    expect(response.body.repairPhotoUrl).toBeNull();
    expect(create.mock.calls[0][1].buffer).toEqual(Buffer.from('photo'));
  });
  it('rejects invalid severity', () =>
    request(app.getHttpServer())
      .post('/reports')
      .field('address', 'Calle 1')
      .field('description', 'Fuga')
      .field('severity', 'invalid')
      .field('reporterPhone', '123')
      .attach('photo', Buffer.from('photo'), 'photo.png')
      .expect(400));
  it('rejects unsupported file types', () =>
    request(app.getHttpServer())
      .post('/reports')
      .attach('photo', Buffer.from('text'), 'photo.txt')
      .expect(400));
  it('returns both photo fields', async () => {
    const response = await request(app.getHttpServer())
      .get('/reports')
      .expect(200);
    expect(response.body[0]).toHaveProperty('photoUrl');
    expect(response.body[0]).toHaveProperty('repairPhotoUrl', null);
  });
});
