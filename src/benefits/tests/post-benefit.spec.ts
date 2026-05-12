import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { BeneficioTipoEnum } from '../enums/beneficio-tipo.enum';

describe('POST /benefits', () => {
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

  it('deve criar benefício com sucesso (201)', async () => {
    const { status, body } = await createBenefit();

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.TIPO).toBe('VALE_REFEICAO');
    expect(body.data?.VALOR).toBe(500);
    expect(body.data?.STATUS_BENEFICIO).toBe('ATIVO');
    expect(body.message).toBe('Benefício criado com sucesso.');
  });

  it('deve retornar 404 quando funcionário não existe', async () => {
    const { status, body } = await createBenefit({
      FUNCIONARIO_ID: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    });

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando TIPO é inválido', async () => {
    const { status, body } = await createBenefit({
      FUNCIONARIO_ID: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      TIPO: 'TIPO_INVALIDO' as BeneficioTipoEnum,
      VALOR: 500,
      DATA_INICIO: '2025-01-01',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando VALOR não é positivo', async () => {
    const { status, body } = await createBenefit({
      TIPO: BeneficioTipoEnum.OUTROS,
      VALOR: -100,
      METADADOS: null,
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createBenefit({}, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve criar VALE_TRANSPORTE e calcular VALOR automaticamente (201)', async () => {
    const { status, body } = await createBenefit({
      TIPO: BeneficioTipoEnum.VALE_TRANSPORTE,
      METADADOS: { VALOR_PASSAGEM: 5.5, QUANTIDADE_DIARIA: 2, DIAS_UTEIS: 22 },
    });

    expect(status).toBe(201);
    expect(body.data?.VALOR).toBe(242);
    expect(body.data?.METADADOS).toMatchObject({ VALOR_PASSAGEM: 5.5 });
  });
});
