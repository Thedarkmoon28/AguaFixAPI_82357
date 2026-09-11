import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { EmailService } from '../email/email.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let emailService: EmailService;

  const mockReportRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((report) =>
      Promise.resolve({
        id: 1,
        ...report,
        isResolved: false,
        createdAt: new Date(),
      }),
    ),
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        address: 'Calle 10 #123',
        description: 'Fuga de agua',
        severity: 'high',
        reporterPhone: '809-555-1234',
        isResolved: false,
        createdAt: new Date(),
      },
    ]),
  };

  const mockEmailService = {
    sendEmail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockReportRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a report and send email notification', async () => {
    const dto = {
      address: 'Calle 10 #123',
      description: 'Fuga de agua',
      severity: 'high',
      reporterPhone: '809-555-1234',
    };

    const result = await service.create(dto);

    expect(mockReportRepository.create).toHaveBeenCalledWith(dto);
    expect(mockReportRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
    expect(result.id).toBe(1);
    expect(result.address).toBe(dto.address);
  });

  it('should return all reports', async () => {
    const result = await service.findAll();
    expect(mockReportRepository.find).toHaveBeenCalledWith({
      order: { createdAt: 'DESC' },
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });
});
