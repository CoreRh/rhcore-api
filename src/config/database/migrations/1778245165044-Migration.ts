import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1778245165044 implements MigrationInterface {
  name = 'Migration1778245165044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FOLHA_PAGAMENTO" ADD "VALOR_PASSAGEM" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "DEPARTAMENTOS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CARGOS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "USUARIOS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "FOLHA_PAGAMENTO" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "BENEFICIOS" ALTER COLUMN "ATUALIZADO_EM" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BENEFICIOS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "FOLHA_PAGAMENTO" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "SOLICITACOES" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "FERIAS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "USUARIOS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "FUNCIONARIOS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "CARGOS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "DEPARTAMENTOS" ALTER COLUMN "ATUALIZADO_EM" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "FOLHA_PAGAMENTO" DROP COLUMN "VALOR_PASSAGEM"`,
    );
  }
}
