import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({ region: envs.AWS_REGION });

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const extensions = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const prefix = folder.replace(/^\/+|\/+$/g, '');
    const key = [prefix, randomUUID() + '.' + extensions[file.mimetype]]
      .filter(Boolean)
      .join('/');
    if (!envs.AWS_S3_BUCKET)
      throw new InternalServerErrorException(
        'Almacenamiento de fotos no configurado',
      );
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: envs.AWS_S3_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch {
      throw new InternalServerErrorException('No se pudo subir la foto');
    }
    return (
      'https://' +
      envs.AWS_S3_BUCKET +
      '.s3.' +
      envs.AWS_REGION +
      '.amazonaws.com/' +
      key
    );
  }
}
