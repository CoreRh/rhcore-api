import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  initTestDataSource,
  updateDepartment,
} from './helpers/department.helper';

describe('PATCH /departments/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar um departamento com sucesso (200)', async () => {
    const created = await createDepartment({
      NOME: 'Vendas',
      SIGLA: 'TEST_VND',
    });
    const id = created.body.data!.ID;

    const response = await updateDepartment(id, { NOME: 'Vendas Atualizado' });
    expect(response.status).toBe(200);
    expect(response.body.succeeded).toBe(true);
    expect(response.body.data?.NOME).toBe('Vendas Atualizado');
    expect(response.body.message).toBe('Departamento atualizado com sucesso.');
  });

  it('deve retornar 404 quando departamento não existe', async () => {
    const response = await updateDepartment(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
    );
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await updateDepartment(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
      false,
    );
    expect(response.status).toBe(401);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 409 ao atualizar para NOME já existente', async () => {
    await createDepartment({ NOME: 'Financeiro', SIGLA: 'TEST_FIN' });
    const second = await createDepartment({
      NOME: 'Marketing',
      SIGLA: 'TEST_MKT',
    });
    const id = second.body.data!.ID;

    const response = await updateDepartment(id, { NOME: 'Financeiro' });
    expect(response.status).toBe(409);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando DEPARTAMENTO_PAI_ID não existe', async () => {
    const created = await createDepartment({
      NOME: 'Compras',
      SIGLA: 'TEST_CMP',
    });
    const id = created.body.data!.ID;

    const response = await updateDepartment(id, {
      DEPARTAMENTO_PAI_ID: '00000000-0000-4000-a000-000000000000',
    });
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário EMPLOYEE tenta atualizar', async () => {
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

    const response = await updateDepartment(
      id,
      { NOME: 'Tentativa' },
      true,
      employeeToken,
    );
    expect(response.status).toBe(403);
    expect(response.body.succeeded).toBe(false);
  });
});
