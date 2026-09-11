import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { EmailService } from '../email/email.service';
import { generateReportTemplate } from './templates/report.template';
import { envs } from '../config/envs';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly emailService: EmailService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create(createReportDto);
    const savedReport = await this.reportRepository.save(report);

    const htmlTemplate = generateReportTemplate(createReportDto);
    const subject = `[Fuga de Agua - ${createReportDto.severity.toUpperCase()}] ${createReportDto.address}`;

    this.emailService
      .sendEmail(envs.MAINTENANCE_EMAIL, subject, htmlTemplate)
      .catch((error) => {
        this.logger.error(
          `Error al enviar notificación para el reporte #${savedReport.id}: ${error?.message || error}`,
        );
      });

    return savedReport;
  }

  async findAll(): Promise<Report[]> {
    return await this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
