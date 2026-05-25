import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  getActivity,
  initTestDataSource,
} from './helpers/dashboard.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { createEmployee } from 'src/employees/tests/helpers/employee.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('GET /dashboard/activity', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve retornar lista de atividades com sucesso (200)', async () => {
    await createEmployee();

    const { status, body } = await getActivity();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Atividades listadas com sucesso.');
  });

  it('deve retornar atividades com os campos corretos', async () => {
    await createEmployee();
    const { body } = await getActivity();

    const item = body.data![0];
    expect(item).toHaveProperty('ID');
    expect(item).toHaveProperty('TIPO');
    expect(item).toHaveProperty('TITULO');
    expect(item).toHaveProperty('DESCRICAO');
    expect(item).toHaveProperty('STATUS');
    expect(item).toHaveProperty('CRIADO_EM');
    expect(['FUNCIONARIO', 'FERIAS', 'SOLICITACAO']).toContain(item.TIPO);
  });

  it('deve retornar ordenado por CRIADO_EM DESC', async () => {
    await createEmployee();
    const { body } = await getActivity();

    const datas = body.data!.map((a) => new Date(a.CRIADO_EM).getTime());
    const ordenado = [...datas].sort((a, b) => b - a);
    expect(datas).toEqual(ordenado);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getActivity(false);
    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando autenticado sem permissão VIEW_REPORTS', async () => {
    const token = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-sem-permissao',
      UserRole.EMPLOYEE,
    );

    const { status } = await getActivity(true, token);
    expect(status).toBe(403);
  });
});
