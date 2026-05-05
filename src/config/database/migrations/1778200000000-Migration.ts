import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1778200000000 implements MigrationInterface {
  name = 'Migration1778200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USUARIOS" ADD CONSTRAINT "UQ_USUARIOS_NOME_USUARIO" UNIQUE ("NOME_USUARIO")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USUARIOS" DROP CONSTRAINT "UQ_USUARIOS_NOME_USUARIO"`,
    );
  }
}
