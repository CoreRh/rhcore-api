import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  deleteBenefit,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('DELETE /benefits/:id', () => {
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

  it('deve remover benefício com sucesso (200)', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const { status, body } = await deleteBenefit(id);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Benefício removido com sucesso.');
  });

  it('deve retornar 404 quando benefício não existe', async () => {
    const { status, body } = await deleteBenefit(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await deleteBenefit(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
