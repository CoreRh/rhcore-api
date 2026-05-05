import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1778100000000 implements MigrationInterface {
  name = 'Migration1778100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ADD "SITUACAO" VARCHAR NOT NULL DEFAULT 'PENDENTE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" DROP COLUMN "SITUACAO"`,
    );
  }
}
