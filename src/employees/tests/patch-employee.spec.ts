import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createEmployee,
  initTestDataSource,
  updateEmployee,
} from './helpers/employee.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('PATCH /employees/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar um funcionário com sucesso (200)', async () => {
    const created = await createEmployee({
      MATRICULA: '2025001',
      CPF: '111.111.111-11',
      EMAIL: 'a@a.com',
    });
    const id = created.body.data!.ID;

    const response = await updateEmployee(id, { NOME: 'João Atualizado' });
    expect(response.status).toBe(200);
    expect(response.body.succeeded).toBe(true);
    expect(response.body.data?.NOME).toBe('João Atualizado');
    expect(response.body.message).toBe('Funcionário atualizado com sucesso.');
  });

  it('deve retornar 404 quando funcionário não existe', async () => {
    const response = await updateEmployee(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
    );
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await updateEmployee(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
      false,
    );
    expect(response.status).toBe(401);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando CPF é inválido', async () => {
    const created = await createEmployee({
      MATRICULA: '2025002',
      CPF: '222.222.222-22',
      EMAIL: 'b@b.com',
    });
    const id = created.body.data!.ID;

    const response = await updateEmployee(id, { CPF: 'cpf-invalido' });
    expect(response.status).toBe(400);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 409 ao atualizar para MATRICULA já existente', async () => {
    await createEmployee({
      MATRICULA: '2025003',
      CPF: '333.333.333-33',
      EMAIL: 'c@c.com',
    });
    const second = await createEmployee({
      MATRICULA: '2025004',
      CPF: '444.444.444-44',
      EMAIL: 'd@d.com',
    });
    const id = second.body.data!.ID;

    const response = await updateEmployee(id, { MATRICULA: '2025003' });
    expect(response.status).toBe(409);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando DEPARTAMENTO_ID não existe', async () => {
    const created = await createEmployee({
      MATRICULA: '2025006',
      CPF: '666.666.666-66',
      EMAIL: 'f@f.com',
    });
    const id = created.body.data!.ID;

    const response = await updateEmployee(id, {
      DEPARTAMENTO_ID: '00000000-0000-4000-a000-000000000000',
    });
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando CARGO_ID não existe', async () => {
    const created = await createEmployee({
      MATRICULA: '2025007',
      CPF: '777.777.777-77',
      EMAIL: 'g@g.com',
    });
    const id = created.body.data!.ID;

    const response = await updateEmployee(id, {
      CARGO_ID: '00000000-0000-4000-a000-000000000000',
    });
    expect(response.status).toBe(404);
    expect(response.body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário EMPLOYEE tenta atualizar', async () => {
    const created = await createEmployee({
      MATRICULA: '2025005',
      CPF: '555.555.555-55',
      EMAIL: 'e@e.com',
    });
    const id = created.body.data!.ID;
    const employeeToken = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-sem-permissao',
      UserRole.EMPLOYEE,
    );

    const response = await updateEmployee(
      id,
      { NOME: 'Tentativa' },
      true,
      employeeToken,
    );
    expect(response.status).toBe(403);
    expect(response.body.succeeded).toBe(false);
  });
});
