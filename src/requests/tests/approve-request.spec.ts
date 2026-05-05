import { AppDataSource } from 'src/config/database/data-source';
import {
  approveRequest,
  cleanupAll,
  createRequest,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/request.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('PATCH /requests/:id/approve', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    await setupDefaultEmployee();
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve aprovar solicitação com sucesso (200)', async () => {
    const created = await createRequest();
    const id = created.body.data!.ID;

    const { status, body } = await approveRequest(id);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.APROVADO_POR).not.toBeNull();
    expect(body.data?.DATA_RESPOSTA).not.toBeNull();
    expect(body.data?.SITUACAO).toBe('APROVADO');
    expect(body.message).toBe('Solicitação aprovada com sucesso.');
  });

  it('deve retornar 404 quando solicitação não existe', async () => {
    const { status, body } = await approveRequest(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const created = await createRequest();
    const id = created.body.data!.ID;

    const { status, body } = await approveRequest(id, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 ao tentar aprovar solicitação já aprovada', async () => {
    const created = await createRequest();
    const id = created.body.data!.ID;

    await approveRequest(id);

    const { status, body } = await approveRequest(id);

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });
});
