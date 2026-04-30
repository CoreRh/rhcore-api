import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

const BASE_URL = 'http://localhost:3001';

describe('PATCH /benefits/:id', () => {
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

  it('deve atualizar benefício com sucesso (200)', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/benefits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({
        VALOR: 600.0,
        STATUS_BENEFICIO: 'INATIVO',
        OBSERVACAO: 'Benefício suspenso temporariamente',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.VALOR).toBe(600);
    expect(body.data?.STATUS_BENEFICIO).toBe('INATIVO');
    expect(body.message).toBe('Benefício atualizado com sucesso.');
  });

  it('deve retornar 400 quando STATUS_BENEFICIO é inválido', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/benefits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ STATUS_BENEFICIO: 'STATUS_INVALIDO' }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando benefício não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/benefits/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
        body: JSON.stringify({ VALOR: 600 }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/benefits/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ VALOR: 600 }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
