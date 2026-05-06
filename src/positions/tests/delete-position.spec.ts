import { AppDataSource } from 'src/config/database/data-source';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createPosition,
  deletePosition,
  initTestDataSource,
} from './helpers/position.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

let employeeToken: string;

describe('DELETE /positions/:id', () => {
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

  it('deve remover um cargo com sucesso (200)', async () => {
    const created = await createPosition({ NOME: 'Cargo Para Deletar' });
    const id = created.body.data!.ID;

    const { status, body } = await deletePosition(id);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Cargo removido com sucesso.');
  });

  it('deve retornar 404 quando o cargo não existe', async () => {
    const { status, body } = await deletePosition(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 403 quando usuário não tem permissão', async () => {
    const created = await createPosition({ NOME: 'Cargo Para 403' });
    const id = created.body.data!.ID;

    const { status, body } = await deletePosition(id, true, employeeToken);

    expect(status).toBe(403);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await deletePosition(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
