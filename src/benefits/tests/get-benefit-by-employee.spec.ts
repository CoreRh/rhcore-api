import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  getBenefitsByEmployee,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('GET /benefits/employee/:funcionarioId', () => {
  let defaultEmployeeId: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    defaultEmployeeId = await setupDefaultEmployee();
  });

  beforeEach(async () => {
    await cleanupAll();
    defaultEmployeeId = await setupDefaultEmployee();
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar benefícios do funcionário com sucesso (200)', async () => {
    await createBenefit();
    const { status, body } = await getBenefitsByEmployee(defaultEmployeeId);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data?.length).toBeGreaterThan(0);
    expect(body.data?.[0].FUNCIONARIO.ID).toBe(defaultEmployeeId);
    expect(body.message).toBe(
      'Benefícios de funcionário listados com sucesso.',
    );
  });

  it('deve retornar lista vazia para funcionário sem benefício', async () => {
    const { status, body } = await getBenefitsByEmployee(
      '23c9639d-443d-457c-9892-f54ba7b267d7',
    );

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.length).toBe(0);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getBenefitsByEmployee(
      defaultEmployeeId,
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
