import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createEmployee,
  getAllEmployees,
  initTestDataSource,
} from './helpers/employee.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('GET /employees', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar funcionários com sucesso (200)', async () => {
    await createEmployee({
      MATRICULA: '2025001',
      CPF: '111.111.111-11',
      EMAIL: 'a@a.com',
    });

    const { status, body } = await getAllEmployees();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Funcionários listados com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getAllEmployees(false);
    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
