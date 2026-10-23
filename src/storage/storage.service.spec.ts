import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';
import { envs } from '../config/envs';
describe('StorageService', () => {
  const send = jest.spyOn(S3Client.prototype, 'send');
  beforeEach(() => {
    envs.AWS_S3_BUCKET = 'test-bucket';
    send.mockReset();
  });
  it('uploads bytes under reports and returns the public URL', async () => {
    send.mockResolvedValue({} as never);
    const buffer = Buffer.from('image');
    const url = await new StorageService().uploadFile(
      { buffer, mimetype: 'image/png' } as Express.Multer.File,
      'reports/',
    );
    expect(
      url.startsWith('https://test-bucket.s3.us-east-2.amazonaws.com/reports/'),
    ).toBe(true);
    expect(url.endsWith('.png')).toBe(true);
    const command = send.mock.calls[0][0] as PutObjectCommand;
    expect(command.input).toMatchObject({
      Bucket: 'test-bucket',
      Body: buffer,
      ContentType: 'image/png',
    });
  });
  it('rejects a failed S3 upload', async () => {
    send.mockRejectedValue(new Error('S3 failure') as never);
    await expect(
      new StorageService().uploadFile(
        {
          buffer: Buffer.from('image'),
          mimetype: 'image/png',
        } as Express.Multer.File,
        'reports',
      ),
    ).rejects.toThrow('No se pudo subir la foto');
  });
});
