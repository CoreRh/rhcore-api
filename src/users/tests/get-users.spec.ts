import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createUser,
  getAllUsers,
  initTestDataSource,
} from './helpers/user.helper';

describe('GET /users', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar usuários com sucesso (200)', async () => {
    await createUser({
      NOME_USUARIO: 'lista-user',
      EMAIL: 'lista@email.com.br',
      SENHA: 'senha123',
    });

    const { status, body } = await getAllUsers();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Usuários listados com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getAllUsers(false);
    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
