import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnimalTable1788302364324 implements MigrationInterface {
    name = 'CreateAnimalTable1788302364324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "animals" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "especie" character varying(100) NOT NULL, "raza" character varying(100), "edad" integer NOT NULL, "peso" numeric(6,2) NOT NULL, CONSTRAINT "PK_6154c334bbb19186788468bce5c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "animals"`);
    }

}
