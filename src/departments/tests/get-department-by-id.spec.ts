import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  getDepartmentsById,
  initTestDataSource,
} from './helpers/department.helper';

describe('GET /departments/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve retornar um departamento pelo ID (200)', async () => {
    const created = await createDepartment({
      NOME: 'Jurídico',
      SIGLA: 'TEST_JUR',
    });
    const id = created.body.data!.ID;

    const { status, body } = await getDepartmentsById(id, true);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.ID).toBe(id);
    expect(body.message).toBe('Departamento encontrado com sucesso.');
  });

  it('deve retornar 404 quando o departamento não existe', async () => {
    const { status, body } = await getDepartmentsById(
      '00000000-0000-0000-0000-000000000000',
      true,
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getDepartmentsById(
      '00000000-0000-0000-0000-000000000000',
      false,
    );
    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
