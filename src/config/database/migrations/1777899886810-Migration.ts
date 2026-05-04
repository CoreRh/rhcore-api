import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777899886810 implements MigrationInterface {
  name = 'Migration1777899886810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "BENEFICIOS" ADD "METADADOS" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "BENEFICIOS" DROP COLUMN "METADADOS"`);
  }
}
