import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: envs.MAILER_SERVICE || undefined,
      host: envs.MAILER_HOST,
      port: envs.MAILER_PORT,
      secure: envs.MAILER_PORT === 465,
      auth: {
        user: envs.MAILER_EMAIL,
        pass: envs.MAILER_SECRET_KEY,
      },
      connectionTimeout: 4000,
      greetingTimeout: 4000,
      socketTimeout: 6000,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
  ): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Municipio - Reporte de Fugas" <${envs.MAILER_EMAIL}>`,
        to,
        subject,
        html: template,
      });

      this.logger.log(
        `Email enviado exitosamente a ${to}: ${info.messageId || 'OK'}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error al enviar email a ${to}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
