import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWaterReportAndSystemUserTables1710000000000 implements MigrationInterface {
  name = 'CreateWaterReportAndSystemUserTables1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "WATER_REPORT" (
        "id" SERIAL NOT NULL,
        "address" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "severity" character varying(20) NOT NULL,
        "reporter_phone" character varying(50) NOT NULL,
        "is_resolved" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_WATER_REPORT_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "SYSTEM_USER" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL,
        "password" character varying(255) NOT NULL,
        "is_notification_enabled" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_SYSTEM_USER_email" UNIQUE ("email"),
        CONSTRAINT "PK_SYSTEM_USER_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
    await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
  }
}
