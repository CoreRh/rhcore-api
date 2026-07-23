import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { AppDataSource } from 'src/config/database/data-source';

const BASE_URL = 'http://localhost:3001/api';

describe('POST /chat', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ MENSAGEM: 'Olá' }),
    });

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando MENSAGEM está vazia', async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ MENSAGEM: '' }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando MENSAGEM não é enviada', async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({}),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando MENSAGEM excede 2000 caracteres', async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ MENSAGEM: 'a'.repeat(2001) }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });
});
