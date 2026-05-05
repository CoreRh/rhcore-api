import { AppDataSource } from 'src/config/database/data-source';
import {
  BASE_URL,
  cleanupAll,
  createUser,
  initTestDataSource,
} from './helpers/user.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('PATCH /users/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar um usuário com sucesso (200)', async () => {
    const created = await createUser({
      NOME_USUARIO: 'patch-user',
      EMAIL: 'patch@email.com.br',
      SENHA: 'senha123',
    });
    const userId = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ NOME_USUARIO: 'patch-atualizado' }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME_USUARIO).toBe('patch-atualizado');
    expect(body.message).toBe('Usuário atualizado com sucesso.');
  });

  it('deve atualizar a senha e fazer hash corretamente', async () => {
    const created = await createUser({
      NOME_USUARIO: 'patch-senha',
      EMAIL: 'patch-senha@email.com.br',
      SENHA: 'senha-antiga123',
    });
    const userId = created.body.data!.ID;

    const patch = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ SENHA: 'senha-nova456' }),
    });
    expect(patch.status).toBe(200);

    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'patch-senha',
        password: 'senha-nova456',
      }),
    });
    const loginBody = await login.json();
    expect(login.status).toBe(200);
    expect(loginBody.data?.access_token).toBeDefined();
  });

  it('deve retornar 404 quando o usuário não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/users/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
        body: JSON.stringify({ NOME_USUARIO: 'qualquer' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário sem permissão tenta atualizar', async () => {
    const created = await createUser({
      NOME_USUARIO: 'patch-403',
      EMAIL: 'patch403@email.com.br',
      SENHA: 'senha123',
    });
    const userId = created.body.data!.ID;

    const token = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-patch',
    );

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ NOME_USUARIO: 'tentativa' }),
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/users/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ NOME_USUARIO: 'qualquer' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
