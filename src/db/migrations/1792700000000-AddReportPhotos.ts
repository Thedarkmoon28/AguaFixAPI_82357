import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddReportPhotos1792700000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "WATER_REPORT" ADD COLUMN "photo_url" text, ADD COLUMN "repair_photo_url" text',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "WATER_REPORT" DROP COLUMN "repair_photo_url", DROP COLUMN "photo_url"',
    );
  }
}
