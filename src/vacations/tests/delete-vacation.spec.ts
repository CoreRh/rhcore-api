import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createVacation,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/vacation.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

const BASE_URL = 'http://localhost:3001/api';

describe('DELETE /vacations/:id', () => {
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

  it('deve remover férias com sucesso (200)', async () => {
    const created = await createVacation();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/vacations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Férias removidas com sucesso.');
  });

  it('deve retornar 404 quando férias não existem', async () => {
    const response = await fetch(
      `${BASE_URL}/vacations/00000000-0000-0000-0000-000000000000`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
      },
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/vacations/00000000-0000-0000-0000-000000000000`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
