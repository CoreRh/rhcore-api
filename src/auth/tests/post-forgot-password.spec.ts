import { AppDataSource } from 'src/config/database/data-source';
import { AuthHelper } from './helpers/auth.helper';

const BASE_URL = 'http://localhost:3001/api';

describe('POST /auth/forgot-password', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('deve retornar 201 com e-mail válido', async () => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EMAIL: 'admin@admin.com.br' }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe(
      'Instruções para recuperação de senha enviadas para o e-mail cadastrado',
    );
  }, 15000);

  it('deve retornar 201 com e-mail inexistente (sem revelar ausência)', async () => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EMAIL: 'inexistent@user.com' }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe(
      'Instruções para recuperação de senha enviadas para o e-mail cadastrado',
    );
  });

  it('deve retornar 400 com e-mail inválido', async () => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nao-é-um-email' }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando e-mail está ausente', async () => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.succeeded).toBe(false);
  });
});
