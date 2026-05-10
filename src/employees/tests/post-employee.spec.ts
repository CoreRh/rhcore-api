import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createEmployee,
  initTestDataSource,
} from './helpers/employee.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /employees', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um funcionário com sucesso (201)', async () => {
    const { status, body } = await createEmployee({
      MATRICULA: '2025001',
      NOME: 'João da Silva',
      CPF: '123.456.789-00',
      EMAIL: 'joao.silva@empresa.com.br',
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('João da Silva');
    expect(body.data?.MATRICULA).toBe('2025001');
    expect(body.message).toBe('Funcionário criado com sucesso.');
  });

  it('deve retornar 409 quando MATRICULA já existe', async () => {
    await createEmployee({
      MATRICULA: '2025002',
      CPF: '111.111.111-11',
      EMAIL: 'a@a.com',
    });
    const { status, body } = await createEmployee({
      MATRICULA: '2025002',
      CPF: '222.222.222-22',
      EMAIL: 'b@b.com',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando o CPF já existe', async () => {
    await createEmployee({
      MATRICULA: '2025003',
      CPF: '333.333.333-33',
      EMAIL: 'c@c.com',
    });

    const { status, body } = await createEmployee({
      MATRICULA: '2025004',
      CPF: '333.333.333-33',
      EMAIL: 'd@d.com',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando o EMAIL já existe', async () => {
    await createEmployee({
      MATRICULA: '20025005',
      CPF: '444.444.444-44',
      EMAIL: 'e@e.com',
    });

    const { status, body } = await createEmployee({
      MATRICULA: '20025006',
      CPF: '555.555.555-55',
      EMAIL: 'e@e.com',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando DEPARTAMENTO_ID não existe', async () => {
    const { status, body } = await createEmployee({
      MATRICULA: '2025010',
      CPF: '010.010.010-10',
      EMAIL: 'dept@test.com',
      DEPARTAMENTO_ID: '00000000-0000-0000-0000-000000000000',
    });
    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando CARGO_ID não existe', async () => {
    const { status, body } = await createEmployee({
      MATRICULA: '2025011',
      CPF: '011.011.011-11',
      EMAIL: 'cargo@test.com',
      CARGO_ID: '00000000-0000-0000-0000-000000000000',
    });
    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createEmployee(
      {
        MATRICULA: '2025099',
        CPF: '999.999.999-99',
        EMAIL: 'z@z.com',
      },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
