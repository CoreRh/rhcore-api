import { AppDataSource } from 'src/config/database/data-source';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createDepartment,
  deleteDepartment,
  initTestDataSource,
} from './helpers/department.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('DELETE /departments/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve remover um departamento com sucesso (200)', async () => {
    const created = await createDepartment({
      NOME: 'Compras',
      SIGLA: 'TEST_CMP',
    });
    const id = created.body.data!.ID;

    const response = await deleteDepartment(id);
    expect(response.status).toBe(200);
    expect(response.body.succeeded).toBe(true);
    expect(response.body.message).toBe('Departamento removido com sucesso.');
  });

  it('deve retornar 404 quando departamento não existe', async () => {
    const response = await deleteDepartment(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await deleteDepartment(
      '00000000-0000-0000-0000-000000000000',
      false,
    );
    expect(response.status).toBe(401);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário EMPLOYEE tenta remover', async () => {
    const created = await createDepartment({
      NOME: 'Operações',
      SIGLA: 'TEST_OPS',
    });
    const id = created.body.data!.ID;
    const employeeToken = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-sem-permissao',
      UserRole.EMPLOYEE,
    );

    const response = await deleteDepartment(id, true, employeeToken);
    expect(response.status).toBe(403);
    expect(response.body.succeeded).toBe(false);
  });
});
