import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPayroll,
  getAllPayrolls,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/payroll.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('GET /payroll', () => {
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

  it('deve retornar lista vazia quando não há folhas cadastradas (200)', async () => {
    const { status, body } = await getAllPayrolls();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data?.length).toBe(0);
  });

  it('deve listar folhas de pagamento com sucesso (200)', async () => {
    await createPayroll();
    const { status, body } = await getAllPayrolls();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data?.length).toBeGreaterThan(0);
    expect(body.message).toBe('Folhas de pagamento listadas com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getAllPayrolls(false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
