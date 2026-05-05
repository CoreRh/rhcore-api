import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from './helpers/auth.helper';

const BASE_URL = 'http://localhost:3001';

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('deve autenticar com sucesso (200)', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data.access_token).toBeDefined();
    expect(body.data.refresh_token).toBeDefined();
    expect(body.data.role).toBeDefined();
    expect(body.message).toBe('Login realizado com sucesso.');
  });

  it('deve retornar 401 com credenciais inválidas', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'senha-errada' }),
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 com usuário inexistente', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nao-existe', password: 'qualquer' }),
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando username está ausente', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin123' }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando o password está ausente', async () => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin' }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });
});
