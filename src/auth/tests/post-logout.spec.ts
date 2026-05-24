import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from './helpers/auth.helper';

const BASE_URL = 'http://localhost:3001/api';

describe('POST /auth/logout', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('deve realizar logout com sucesso (201)', async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
    });

    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Logout realizado com sucesso');
  });

  it('deve retornar 401 sem access token', async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 com token inválido', async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-invalido',
      },
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
