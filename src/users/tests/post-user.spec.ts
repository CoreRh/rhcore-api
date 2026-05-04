import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createUser,
  initTestDataSource,
} from './helpers/user.helper';

describe('POST /users', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um usuário com sucesso (201)', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: 'novo-usuario',
      EMAIL: 'novo@email.com.br',
      SENHA: 'senha123',
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data?.NOME_USUARIO).toBe('novo-usuario');
    expect(body.data?.EMAIL).toBe('novo@email.com.br');
    expect(body.message).toBe('Usuário criado com sucesso.');
  });

  it('deve retornar 400 quando NOME_USUARIO está ausente', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: '',
      EMAIL: 'teste@email.com.br',
      SENHA: 'senha123',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando NOME_USUARIO é muito curto (< 3 chars)', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: 'ab',
      EMAIL: 'curto@email.com.br',
      SENHA: 'senha123',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando EMAIL é inválido', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: 'usuario-valido',
      EMAIL: 'email-invalido',
      SENHA: 'senha123',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 400 quando SENHA é muito curta (< 6 chars)', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: 'usuario-valido',
      EMAIL: 'valido@email.com.br',
      SENHA: '123',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando o e-mail já está em uso', async () => {
    await createUser({
      NOME_USUARIO: 'primeiro-usuario',
      EMAIL: 'duplicado@email.com.br',
      SENHA: 'senha123',
    });

    const { status, body } = await createUser({
      NOME_USUARIO: 'segundo-usuario',
      EMAIL: 'duplicado@email.com.br',
      SENHA: 'senha123',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createUser(
      {
        NOME_USUARIO: 'sem-auth',
        EMAIL: 'semauth@email.com.br',
        SENHA: 'senha123',
      },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
