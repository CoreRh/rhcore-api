import { AppDataSource } from 'src/config/database/data-source';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createEmployee,
  deleteEmployee,
  initTestDataSource,
} from './helpers/employee.helper';

describe('DELETE /employees/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve remover um funcionário com sucesso (200)', async () => {
    const created = await createEmployee({
      MATRICULA: '2025001',
      CPF: '111.111.111-11',
      EMAIL: 'a@a.com',
    });
    const id = created.body.data!.ID;

    const response = await deleteEmployee(id);
    expect(response.status).toBe(200);
    expect(response.body.succeeded).toBe(true);
    expect(response.body.message).toBe('Funcionário removido com sucesso.');
  });

  it('deve retornar 404 quando funcionário não existe', async () => {
    const response = await deleteEmployee(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await deleteEmployee(
      '00000000-0000-0000-0000-000000000000',
      false,
    );
    expect(response.status).toBe(401);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário EMPLOYEE tenta remover', async () => {
    const created = await createEmployee({
      MATRICULA: '2025005',
      CPF: '555.555.555-55',
      EMAIL: 'e@e.com',
    });
    const id = created.body.data!.ID;
    const employeeToken = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee_test',
    );

    const response = await deleteEmployee(id, true, employeeToken);
    expect(response.status).toBe(403);
    expect(response.body.succeeded).toBe(false);
  });
});
