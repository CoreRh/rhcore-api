import { AppDataSource } from 'src/config/database/data-source';
import {
  BASE_URL,
  cleanupAll,
  createRequest,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/request.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('PATCH /requests/:id', () => {
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

  it('deve atualizar solicitação com sucesso (200)', async () => {
    const created = await createRequest();
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({
        DESCRICAO: 'Descrição atualizada',
        OBSERVACAO: 'Observação de teste',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.DESCRICAO).toBe('Descrição atualizada');
    expect(body.message).toBe('Solicitação atualizada com sucesso.');
  });

  it('deve retornar 404 quando solicitação não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/requests/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
        body: JSON.stringify({ DESCRICAO: 'Descrição atualizada' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/requests/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DESCRICAO: 'Descrição atualizada' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando funcionário tenta alterar solicitação de outro', async () => {
    const created = await createRequest();
    const id = created.body.data!.ID;

    const token = await AuthHelper.createSessionAs(
      AppDataSource,
      'outro-funcionario',
    );

    const response = await fetch(`${BASE_URL}/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ DESCRICAO: 'Tentativa indevida' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.succeeded).toBe(false);
  });
});
