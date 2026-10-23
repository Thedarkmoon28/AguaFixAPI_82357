import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
      fileFilter: (_req, file, callback) => {
        if (
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
        ) {
          return callback(
            new BadRequestException('La foto debe ser JPG, PNG o WebP'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreateReportDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<Report> {
    if (!photo || !photo.size)
      throw new BadRequestException('La foto de la fuga es obligatoria');
    return this.reportsService.create(dto, photo);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }
}
