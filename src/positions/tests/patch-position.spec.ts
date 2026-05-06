import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import {
  cleanupAll as cleanupPositions,
  createPosition,
  initTestDataSource,
  updatePosition,
} from './helpers/position.helper';
import { createDepartment } from 'src/departments/tests/helpers/department.helper';
import { UserRole } from 'src/common/enums/user-role.enum';
import { cleanupAll as cleanupDepartments } from 'src/departments/tests/helpers/department.helper';

let employeeToken: string;

describe('PATCH /positions/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    employeeToken = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee_teste',
      UserRole.EMPLOYEE,
    );
  });

  afterAll(async () => {
    await cleanupPositions();
    await cleanupDepartments();
    await AppDataSource.destroy();
  });

  it('deve atualizar um cargo com sucesso (200)', async () => {
    const created = await createPosition({ NOME: 'Analista Junior' });
    const id = created.body.data!.ID;

    const { status, body } = await updatePosition(id, {
      NOME: 'Analista Junior Atualizado',
    });

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Analista Junior Atualizado');
    expect(body.message).toBe('Cargo atualizado com sucesso.');
  });

  it('deve persistir DEPARTAMENTO_ID ao atualizar (200)', async () => {
    const dept = await createDepartment({ NOME: 'RH Patch', SIGLA: 'RHP' });
    const deptId = dept.body.data!.ID;
    const created = await createPosition({ NOME: 'Cargo com Dept' });
    const id = created.body.data!.ID;

    const { status, body } = await updatePosition(id, {
      DEPARTAMENTO_ID: deptId,
    });

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.DEPARTAMENTO?.ID).toBe(deptId);
  });

  it('deve retornar 404 quando o cargo não existe', async () => {
    const { status, body } = await updatePosition(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando o DEPARTAMENTO_ID não é um UUID válido', async () => {
    const created = await createPosition({ NOME: 'Cargo UUID Inválido' });
    const id = created.body.data!.ID;

    const { status, body } = await updatePosition(id, {
      DEPARTAMENTO_ID: 'não-e-um-uuid',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando NOME já existe', async () => {
    await createPosition({ NOME: 'Cargo Existente' });
    const second = await createPosition({ NOME: 'Cargo Para Atualizar' });
    const id = second.body.data!.ID;

    const { status, body } = await updatePosition(id, {
      NOME: 'Cargo Existente',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário não tem permissão', async () => {
    const created = await createPosition({ NOME: 'Cargo Para 403' });
    const id = created.body.data!.ID;

    const { status, body } = await updatePosition(
      id,
      { NOME: 'Tentativa' },
      true,
      employeeToken,
    );

    expect(status).toBe(403);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await updatePosition(
      '00000000-0000-0000-0000-000000000000',
      { NOME: 'Qualquer' },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
