import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  getAllDepartments,
  initTestDataSource,
} from './helpers/department.helper';

describe('GET /departments', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar departamentos com sucesso (200)', async () => {
    await createDepartment({ NOME: 'Operações', SIGLA: 'TEST_OPS' });

    const { status, body } = await getAllDepartments();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Departamentos listados com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getAllDepartments(false);
    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
