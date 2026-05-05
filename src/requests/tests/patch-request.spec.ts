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

    await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({
        NOME_USUARIO: 'outro-funcionario',
        EMAIL: 'outro@email.com.br',
        SENHA: 'senha123',
        ROLE: 'EMPLOYEE',
      }),
    });

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'outro-funcionario',
        password: 'senha123',
      }),
    });
    const loginBody = await loginRes.json();
    const otherToken = loginBody.data.access_token;

    const response = await fetch(`${BASE_URL}/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${otherToken}`,
      },
      body: JSON.stringify({ DESCRICAO: 'Tentativa indevida' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.succeeded).toBe(false);
  });
});
