import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1784485550240 implements MigrationInterface {
  name = 'Migration1784485550240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ADIANTAMENTOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_POR" character varying(20), "EXCLUIDO_EM" TIMESTAMP, "VALOR" numeric(10,2) NOT NULL, "DATA_SOLICITACAO" date NOT NULL, "NUMERO_PARCELAS" integer NOT NULL, "STATUS_ADIANTAMENTO" character varying NOT NULL DEFAULT 'PENDENTE', "DATA_APROVACAO" TIMESTAMP, "OBSERVACAO" character varying(500), "FUNCIONARIO_ID" uuid, "APROVADO_POR_ID" uuid, CONSTRAINT "PK_fb956be6621f9d507f38bba0af0" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5677894368c5319fd48f158faa" ON "ADIANTAMENTOS" ("STATUS_ADIANTAMENTO") `,
    );
    await queryRunner.query(
      `CREATE TABLE "PARCELAS_ADIANTAMENTO" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_POR" character varying(20), "EXCLUIDO_EM" TIMESTAMP, "ADIANTAMENTO_ID" uuid NOT NULL, "NUMERO_PARCELA" integer NOT NULL, "VALOR_PARCELA" numeric(10,2) NOT NULL, "MES_REFERENCIA" integer NOT NULL, "ANO_REFERENCIA" integer NOT NULL, "FOLHA_PAGAMENTO_ID" uuid, "STATUS_PARCELA" character varying NOT NULL DEFAULT 'PENDENTE', CONSTRAINT "PK_2a99abc2a35c4a0a9b7962318c3" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_864f744328c794a31d53c73b79" ON "PARCELAS_ADIANTAMENTO" ("ANO_REFERENCIA", "MES_REFERENCIA", "STATUS_PARCELA") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c37b8d6bd4afd9697774db34b9" ON "PARCELAS_ADIANTAMENTO" ("ADIANTAMENTO_ID") `,
    );
    await queryRunner.query(
      `CREATE TABLE "DESPESAS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_POR" character varying(20), "EXCLUIDO_EM" TIMESTAMP, "CATEGORIA" character varying NOT NULL, "DESCRICAO" character varying(255) NOT NULL, "VALOR" numeric(10,2) NOT NULL, "DATA_DESPESA" date NOT NULL, "COMPROVANTE_URL" character varying(255), "STATUS_DESPESA" character varying NOT NULL DEFAULT 'PENDENTE', "DATA_APROVACAO" TIMESTAMP, "OBSERVACAO" character varying(500), "FUNCIONARIO_ID" uuid, "APROVADO_POR_ID" uuid, CONSTRAINT "PK_0203c14462afbbcb13c9cf647ff" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_79abd764e7c13a72c08573b4b0" ON "DESPESAS" ("DATA_DESPESA") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54f100050b6a72d595d3dc99e6" ON "DESPESAS" ("STATUS_DESPESA") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ORCAMENTOS" ("ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "CRIADO_POR" character varying(20) NOT NULL, "CRIADO_EM" TIMESTAMP NOT NULL DEFAULT now(), "STATUS" character varying NOT NULL DEFAULT 'ATIVO', "ATUALIZADO_POR" character varying(20), "ATUALIZADO_EM" TIMESTAMP DEFAULT now(), "EXCLUIDO_POR" character varying(20), "EXCLUIDO_EM" TIMESTAMP, "ANO_REFERENCIA" integer NOT NULL, "MES_REFERENCIA" integer NOT NULL, "CATEGORIA" character varying NOT NULL, "VALOR_ORCADO" numeric(10,2) NOT NULL, "OBSERVACAO" character varying(500), "DEPARTAMENTO_ID" uuid, CONSTRAINT "UQ_72d2fbf772862889fde27c0b874" UNIQUE ("DEPARTAMENTO_ID", "ANO_REFERENCIA", "MES_REFERENCIA", "CATEGORIA"), CONSTRAINT "PK_48da97b32111171d8a4c8f235f3" PRIMARY KEY ("ID"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7030a2c1342e153df45556306" ON "ORCAMENTOS" ("ANO_REFERENCIA", "MES_REFERENCIA") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ADIANTAMENTOS" ADD CONSTRAINT "FK_c835c8a15ecf47c2a5352462489" FOREIGN KEY ("FUNCIONARIO_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADIANTAMENTOS" ADD CONSTRAINT "FK_2feba37427a5b427067f5a9d670" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "USUARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PARCELAS_ADIANTAMENTO" ADD CONSTRAINT "FK_c37b8d6bd4afd9697774db34b97" FOREIGN KEY ("ADIANTAMENTO_ID") REFERENCES "ADIANTAMENTOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PARCELAS_ADIANTAMENTO" ADD CONSTRAINT "FK_7d96a11c5f0f0d956a503f22970" FOREIGN KEY ("FOLHA_PAGAMENTO_ID") REFERENCES "FOLHA_PAGAMENTO"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DESPESAS" ADD CONSTRAINT "FK_a3134fd142888f8148362df2cf6" FOREIGN KEY ("FUNCIONARIO_ID") REFERENCES "FUNCIONARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DESPESAS" ADD CONSTRAINT "FK_be40cf81ccb5e8ba73fdd012d3b" FOREIGN KEY ("APROVADO_POR_ID") REFERENCES "USUARIOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ORCAMENTOS" ADD CONSTRAINT "FK_952972a9c051c1c268a8664f378" FOREIGN KEY ("DEPARTAMENTO_ID") REFERENCES "DEPARTAMENTOS"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ORCAMENTOS" DROP CONSTRAINT "FK_952972a9c051c1c268a8664f378"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DESPESAS" DROP CONSTRAINT "FK_be40cf81ccb5e8ba73fdd012d3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DESPESAS" DROP CONSTRAINT "FK_a3134fd142888f8148362df2cf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PARCELAS_ADIANTAMENTO" DROP CONSTRAINT "FK_7d96a11c5f0f0d956a503f22970"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PARCELAS_ADIANTAMENTO" DROP CONSTRAINT "FK_c37b8d6bd4afd9697774db34b97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADIANTAMENTOS" DROP CONSTRAINT "FK_2feba37427a5b427067f5a9d670"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ADIANTAMENTOS" DROP CONSTRAINT "FK_c835c8a15ecf47c2a5352462489"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d7030a2c1342e153df45556306"`,
    );
    await queryRunner.query(`DROP TABLE "ORCAMENTOS"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54f100050b6a72d595d3dc99e6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79abd764e7c13a72c08573b4b0"`,
    );
    await queryRunner.query(`DROP TABLE "DESPESAS"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c37b8d6bd4afd9697774db34b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_864f744328c794a31d53c73b79"`,
    );
    await queryRunner.query(`DROP TABLE "PARCELAS_ADIANTAMENTO"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5677894368c5319fd48f158faa"`,
    );
    await queryRunner.query(`DROP TABLE "ADIANTAMENTOS"`);
  }
}
