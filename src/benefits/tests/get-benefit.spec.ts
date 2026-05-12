import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  getAllBenefits,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('GET /benefits', () => {
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

  it('deve listar benefícios com sucesso (200)', async () => {
    await createBenefit();
    const { status, body } = await getAllBenefits();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data?.length).toBeGreaterThan(0);
    expect(body.message).toBe('Benefícios listados com sucesso.');
  });

  it('deve retornar 401 quando não for autenticado', async () => {
    const { status, body } = await getAllBenefits(false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
