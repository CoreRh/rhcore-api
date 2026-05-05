import { AppDataSource } from '../../config/database/data-source';
import {
  BASE_URL,
  cleanupAll,
  createUser,
  initTestDataSource,
} from './helpers/user.helper';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';

describe('DELETE /users/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve remover um usuário com sucesso (200)', async () => {
    const created = await createUser({
      NOME_USUARIO: 'delete-user',
      EMAIL: 'delete@email.com.br',
      SENHA: 'senha123',
    });
    const userId = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Usuário removido com sucesso.');
  });

  it('deve retornar 404 quando usuário não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/users/00000000-0000-0000-0000-000000000000`,
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

  it('deve retornar 403 quando usuário sem permissão tenta remover', async () => {
    const created = await createUser({
      NOME_USUARIO: 'delete-403',
      EMAIL: 'delete403@email.com.br',
      SENHA: 'senha123',
    });
    const userId = created.body.data!.ID;

    const token = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-delete',
    );

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/users/00000000-0000-0000-0000-000000000000`,
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
