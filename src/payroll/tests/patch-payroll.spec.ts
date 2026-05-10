import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPayroll,
  initTestDataSource,
  setupDefaultEmployee,
  updatePayroll,
} from './helpers/payroll.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('PATCH /payroll/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    await setupDefaultEmployee();
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar folha de pagamento com sucesso (200)', async () => {
    const created = await createPayroll();
    const id = created.body.data!.ID;

    const { status, body } = await updatePayroll(id, {
      SALARIO_BASE: 6000,
      OBSERVACAO: 'Observação atualizada',
    });

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.SALARIO_BASE).toBe(6000);
    expect(body.data?.OBSERVACAO).toBe('Observação atualizada');
    expect(body.message).toBe('Folha de pagamento atualizada com sucesso.');
  });

  it('deve recalcular SALARIO_LIQUIDO ao atualizar valores (200)', async () => {
    const created = await createPayroll({ MES_REFERENCIA: 5 });
    const id = created.body.data!.ID;

    const { status, body } = await updatePayroll(id, {
      SALARIO_BASE: 8000,
      BONUS: 1000,
      DESCONTO_INSS: 800,
      DESCONTO_IRRF: 500,
      OUTROS_DESCONTOS: 200,
      VALOR_PASSAGEM: 200,
    });

    expect(status).toBe(200);
    expect(body.data?.SALARIO_LIQUIDO).toBe(7300);
  });

  it('deve recalcular DESCONTO_VT ao atualizar VALOR_PASSAGEM (200)', async () => {
    const created = await createPayroll({
      MES_REFERENCIA: 8,
      SALARIO_BASE: 5000,
      DESCONTO_INSS: 500,
      DESCONTO_IRRF: 200,
      VALOR_PASSAGEM: 200,
    });
    const id = created.body.data!.ID;

    const { status, body } = await updatePayroll(id, {
      VALOR_PASSAGEM: 400,
      DESCONTO_INSS: 500,
      DESCONTO_IRRF: 200,
    });

    expect(status).toBe(200);
    expect(body.data?.DESCONTO_VT).toBe(300);
    expect(body.data?.SALARIO_LIQUIDO).toBe(4000);
  });

  it('deve recalcular INSS e IRRF automaticamente ao atualizar SALARIO_BASE (200)', async () => {
    const created = await createPayroll({ MES_REFERENCIA: 9 });
    const id = created.body.data!.ID;

    const { status, body } = await updatePayroll(id, { SALARIO_BASE: 6000 });

    expect(status).toBe(200);
    expect(body.data?.DESCONTO_INSS).toBe(649.6);
    expect(body.data?.DESCONTO_IRRF).toBe(575.36);
    expect(body.data?.SALARIO_LIQUIDO).toBe(4775.04);
  });

  it('deve retornar 409 ao atualizar para mês/ano já existente para o funcionario', async () => {
    await createPayroll({ MES_REFERENCIA: 6 });
    const second = await createPayroll({ MES_REFERENCIA: 7 });
    const id = second.body.data!.ID;

    const { status, body } = await updatePayroll(id, { MES_REFERENCIA: 6 });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando a folha de pagamento não existe', async () => {
    const { status, body } = await updatePayroll(
      '00000000-0000-0000-0000-000000000000',
      { OBSERVACAO: 'teste' },
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await updatePayroll(
      '00000000-0000-0000-0000-000000000000',
      { OBSERVACAO: 'teste' },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
