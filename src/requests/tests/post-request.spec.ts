import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createRequest,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/request.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /requests', () => {
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

  it('deve criar uma solicitação com sucesso (201)', async () => {
    const { status, body } = await createRequest();

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.TIPO).toBe('DOCUMENTO');
    expect(body.message).toBe('Solicitação criada com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createRequest(undefined, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando FUNCIONARIO_ID está ausente', async () => {
    const { status, body } = await createRequest({
      FUNCIONARIO_ID: undefined as any,
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando TIPO é inválido', async () => {
    const { status, body } = await createRequest({ TIPO: 'INVALIDO' as any });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });
});
