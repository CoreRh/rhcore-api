import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPosition,
  initTestDataSource,
} from './helpers/position.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

let employeeToken: string;

describe('POST /positions', () => {
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
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um cargo com sucesso (201)', async () => {
    const { status, body } = await createPosition({
      NOME: 'Analista de Sistemas',
      NIVEL: 'Pleno',
      SALARIO_BASE: 7000,
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Analista de Sistemas');
    expect(body.data?.NIVEL).toBe('Pleno');
    expect(body.message).toBe('Cargo criado com sucesso.');
  });

  it('deve retornar 409 quando NOME já existe', async () => {
    await createPosition({ NOME: 'Gerente de TI' });
    const { status, body } = await createPosition({ NOME: 'Gerente de TI' });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando o body é inválido', async () => {
    const { status, body } = await createPosition({ NOME: '' });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando NOME excede 100 caracteres', async () => {
    const { status, body } = await createPosition({ NOME: 'A'.repeat(101) });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createPosition({ NOME: 'Sem Auth' }, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário não tem permissão', async () => {
    const { status, body } = await createPosition(
      { NOME: 'Cargo 403' },
      true,
      employeeToken,
    );

    expect(status).toBe(403);
    expect(body.succeeded).toBe(false);
  });
});
