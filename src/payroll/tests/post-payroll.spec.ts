import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPayroll,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/payroll.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /payroll', () => {
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

  it('deve criar uma folha de pagamento com sucesso (201)', async () => {
    const { status, body } = await createPayroll({
      MES_REFERENCIA: 3,
      ANO_REFERENCIA: 2025,
      SALARIO_BASE: 5000,
      BONUS: 500,
      DESCONTO_INSS: 550,
      DESCONTO_IRRF: 300,
      OUTROS_DESCONTOS: 100,
      VALOR_PASSAGEM: 400,
      OBSERVACAO: 'Folha do mês de março',
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data?.MES_REFERENCIA).toBe(3);
    expect(body.data?.ANO_REFERENCIA).toBe(2025);
    expect(body.data?.DESCONTO_VT).toBe(300);
    expect(body.data?.SALARIO_BASE).toBe(5000);
    expect(body.data?.SALARIO_LIQUIDO).toBe(4250);
    expect(body.data?.STATUS_FOLHA).toBe('PENDENTE');
    expect(body.message).toBe('Folha de pagamento criada com sucesso.');
  });

  it('deve aplicar teto de 6% quando VALOR_PASSAGEM supera o limite', async () => {
    const { status, body } = await createPayroll({
      MES_REFERENCIA: 8,
      ANO_REFERENCIA: 2055,
      SALARIO_BASE: 5000,
      DESCONTO_INSS: 500,
      DESCONTO_IRRF: 200,
      OUTROS_DESCONTOS: 0,
      VALOR_PASSAGEM: 400,
    });

    expect(status).toBe(201);
    expect(body.data?.DESCONTO_VT).toBe(300);
    expect(body.data?.SALARIO_LIQUIDO).toBe(4000);
  });

  it('deve usar o valor real da passagem quando menor que 6% do salário', async () => {
    const { status, body } = await createPayroll({
      MES_REFERENCIA: 9,
      ANO_REFERENCIA: 2025,
      SALARIO_BASE: 5000,
      DESCONTO_INSS: 500,
      DESCONTO_IRRF: 200,
      OUTROS_DESCONTOS: 0,
      VALOR_PASSAGEM: 200,
    });

    expect(status).toBe(201);
    expect(body.data?.DESCONTO_VT).toBe(200);
    expect(body.data?.SALARIO_LIQUIDO).toBe(4100);
  });

  it('deve manter DESCONTO_VT zerado quando VALOR_PASSAGEM não é informado', async () => {
    const { status, body } = await createPayroll({
      MES_REFERENCIA: 10,
      ANO_REFERENCIA: 2025,
      SALARIO_BASE: 5000,
      DESCONTO_INSS: 500,
      DESCONTO_IRRF: 200,
    });

    expect(status).toBe(201);
    expect(body.data?.DESCONTO_VT).toBe(0);
  });

  it('deve retornar 409 quando já existe folha de pagamento para o mesmo funcionário no mesmo mês/ano', async () => {
    await createPayroll({ MES_REFERENCIA: 4, ANO_REFERENCIA: 2025 });
    const { status, body } = await createPayroll({
      MES_REFERENCIA: 4,
      ANO_REFERENCIA: 2025,
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando FUNCIONARIO_ID está ausente', async () => {
    const { status, body } = await createPayroll({ FUNCIONARIO_ID: '' });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando MES_REFERENCIA é inválido (13)', async () => {
    const { status, body } = await createPayroll({ MES_REFERENCIA: 13 });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando o ANO_REFERENCIA é inválido (< 2000)', async () => {
    const { status, body } = await createPayroll({ ANO_REFERENCIA: 1999 });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando SALARIO_BASE é negativo', async () => {
    const { status, body } = await createPayroll({ SALARIO_BASE: -100 });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando FUNCIONARIO_ID não existe', async () => {
    const { status, body } = await createPayroll({
      FUNCIONARIO_ID: 'a3bb189e-8bf9-4888-9912-ace4e6543099',
    });

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createPayroll(undefined, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
