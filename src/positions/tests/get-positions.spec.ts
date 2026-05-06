import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createPosition,
  getAllPositions,
  initTestDataSource,
} from './helpers/position.helper';

describe('GET /positions', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar cargos com sucesso (200)', async () => {
    await createPosition({ NOME: 'Desenvolvedor Senior' });

    const { status, body } = await getAllPositions();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Cargos listados com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getAllPositions(false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
