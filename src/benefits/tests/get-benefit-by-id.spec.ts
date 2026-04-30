import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  getBenefitById,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('GET /benefits/:id', () => {
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

  it('deve buscar benefício por ID com sucesso (200)', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const { status, body } = await getBenefitById(id);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.ID).toBe(id);
    expect(body.message).toBe('Benefício encontrado com sucesso.');
  });

  it('deve retornar 404 quando benefício não existe', async () => {
    const { status, body } = await getBenefitById(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getBenefitById(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
