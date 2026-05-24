import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from './helpers/auth.helper';

const BASE_URL = 'http://localhost:3001/api';

describe('POST /auth/refresh', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('deve renovar os tokens com sucesso (201)', async () => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getRefreshHeader(),
      },
    });

    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data.access_token).toBeDefined();
    expect(body.data.refresh_token).toBeDefined();
  });

  it('deve retornar 401 sem refresh token', async () => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 com token inválido', async () => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
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
