import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createVacation,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/vacation.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

const BASE_URL = 'http://localhost:3001/api';

describe('PATCH /vacations/:id', () => {
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

  it('deve atualizar férias com sucesso (200)', async () => {
    const created = await createVacation();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/vacations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({
        STATUS_FERIAS: 'APROVADO',
        OBSERVACAO: 'Aprovado pela gestão',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.STATUS_FERIAS).toBe('APROVADO');
    expect(body.message).toBe('Férias atualizadas com sucesso.');
  });

  it('deve retornar 400 quando DATA_FIM é anterior à DATA_INICIO', async () => {
    const created = await createVacation();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/vacations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({
        DATA_INICIO: '2025-07-30',
        DATA_FIM: '2025-07-01',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando férias não existem', async () => {
    const response = await fetch(
      `${BASE_URL}/vacations/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
        body: JSON.stringify({ STATUS_FERIAS: 'APROVADO' }),
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ STATUS_FERIAS: 'APROVADO' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
