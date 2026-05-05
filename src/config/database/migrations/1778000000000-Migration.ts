import { MigrationInterface, QueryRunner } from 'typeorm';

const TABLES = [
  'USUARIOS',
  'FUNCIONARIOS',
  'DEPARTAMENTOS',
  'CARGOS',
  'SOLICITACOES',
  'FOLHA_PAGAMENTO',
  'BENEFICIOS',
  'FERIAS',
];

export class Migration1778000000000 implements MigrationInterface {
  name = 'Migration1778000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD "ATUALIZADO_EM" TIMESTAMP`,
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD "EXCLUIDO_EM" TIMESTAMP`,
      );
    }

    await queryRunner.query(
      `ALTER TABLE "USUARIOS" RENAME COLUMN "RESET_PASSWORD" TO "RESET_PASSWORD_TOKEN"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USUARIOS" RENAME COLUMN "RESET_PASSWORD_TOKEN" TO "RESET_PASSWORD"`,
    );

    for (const table of [...TABLES].reverse()) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP COLUMN "EXCLUIDO_EM"`,
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP COLUMN "ATUALIZADO_EM"`,
      );
    }
  }
}
