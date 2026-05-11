import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  initTestDataSource,
} from './helpers/department.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('POST /departments', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um departamento com sucesso (201)', async () => {
    const { status, body } = await createDepartment({
      NOME: 'Recursos Humanos',
      SIGLA: 'RH',
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Recursos Humanos');
    expect(body.data?.SIGLA).toBe('RH');
    expect(body.message).toBe('Departamento criado com sucesso.');
  });

  it('deve retornar 409 quando NOME já existe', async () => {
    await createDepartment({ NOME: 'Financeiro', SIGLA: 'FIN' });
    const { status, body } = await createDepartment({
      NOME: 'Financeiro',
      SIGLA: 'FIN2',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando a SIGLA já existe', async () => {
    await createDepartment({ NOME: 'Marketing', SIGLA: 'MKT' });
    const { status, body } = await createDepartment({
      NOME: 'Marketing 2',
      SIGLA: 'MKT',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando NOME está vazio', async () => {
    const { status, body } = await createDepartment({ NOME: '', SIGLA: 'TST' });
    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando a SIGLA tem menos de 2 caracteres', async () => {
    const { status, body } = await createDepartment({
      NOME: 'Jurídico',
      SIGLA: 'J',
    });
    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando DEPARTAMENTO_PAI_ID não existe', async () => {
    const { status, body } = await createDepartment({
      NOME: 'Jurídico',
      SIGLA: 'JUR',
      DEPARTAMENTO_PAI_ID: '00000000-0000-4000-a000-000000000000',
    });
    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário EMPLOYEE tenta criar', async () => {
    const employeeToken = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-sem-permisssao',
      UserRole.EMPLOYEE,
    );
    const { status, body } = await createDepartment(
      { NOME: 'Tentativa', SIGLA: 'TNT' },
      true,
      employeeToken,
    );
    expect(status).toBe(403);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createDepartment(
      { NOME: 'Sem Auth', SIGLA: 'SA' },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
