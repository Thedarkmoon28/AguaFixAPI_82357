import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReport = {
    id: 1,
    address: 'Calle 10 #123',
    description: 'Fuga de agua',
    severity: 'high',
    reporterPhone: '809-555-1234',
    isResolved: false,
    createdAt: new Date(),
  };

  const mockReportsService = {
    create: jest.fn().mockResolvedValue(mockReport),
    findAll: jest.fn().mockResolvedValue([mockReport]),
  };

  beforeEach(async () => {
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
    service = module.get<ReportsService>(ReportsService);
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
    expect(service.create).toHaveBeenCalledWith(dto, photo);
    expect(result).toEqual(mockReport);
  });

  it('rejects missing photo', async () => {
    await expect(
      controller.create({
        address: 'A',
        description: 'B',
        severity: 'high',
        reporterPhone: '1',
      }),
    ).rejects.toThrow('La foto de la fuga es obligatoria');
  });

  it('GET /reports should return an array of reports', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockReport]);
  });
});
