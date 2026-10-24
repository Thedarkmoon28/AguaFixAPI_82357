/// <reference types="jest" />
/// <reference types="multer" />

import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockReport = {
    id: 1,
    address: 'Calle 10 #123',
    description: 'Fuga de agua',
    severity: 'high',
    reporterPhone: '809-555-1234',
    photoUrl: 'https://example.com/reports/photo.png',
    repairPhotoUrl: null,
    isResolved: false,
    createdAt: new Date(),
  };

  const mockReportsService = {
    create: jest.fn().mockResolvedValue(mockReport),
    findAll: jest.fn().mockResolvedValue([mockReport]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /reports should create a report', async () => {
    const dto = {
      address: 'Calle 10 #123',
      description: 'Fuga de agua',
      severity: 'high',
      reporterPhone: '809-555-1234',
    };

    const photo = {
      size: 10,
      buffer: Buffer.from('photo'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    const result = await controller.create(dto, photo);

    expect(mockReportsService.create).toHaveBeenCalledWith(dto, photo);
    expect(result).toEqual(mockReport);
  });

  it('rejects missing photo', async () => {
    const dto = {
      address: 'Calle 1',
      description: 'Fuga de agua',
      severity: 'high',
      reporterPhone: '5551234567',
    };

    await expect(controller.create(dto)).rejects.toThrow(
      'La foto de la fuga es obligatoria',
    );

    expect(mockReportsService.create).not.toHaveBeenCalled();
  });

  it('GET /reports should return an array of reports', async () => {
    const result = await controller.findAll();

    expect(mockReportsService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockReport]);
  });
});