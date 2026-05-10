import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPayroll,
  getPayrollSlip,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/payroll.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { UserRole } from 'src/common/enums/user-role.enum';

describe('GET /payroll/:id/slip', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    await cleanupAll();
    await setupDefaultEmployee();
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve gerar holerite em PDF com sucesso (200)', async () => {
    const created = await createPayroll();
    const id = created.body.data!.ID;

    const { status, contentType } = await getPayrollSlip(id);

    expect(status).toBe(200);
    expect(contentType).toBe('application/pdf');
  });

  it('deve retornar 404 quando folha de pagamento não existe', async () => {
    const { status } = await getPayrollSlip(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status } = await getPayrollSlip(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
  });

  it('deve retornar 403 quando autenticado sem permissao MANAGE_PAYROLL', async () => {
    const created = await createPayroll({ MES_REFERENCIA: 4 });
    const id = created.body.data!.ID;

    const token = await AuthHelper.createSessionAs(
      AppDataSource,
      'employee-sem-permissao',
      UserRole.EMPLOYEE,
    );

    const { status } = await getPayrollSlip(id, true, token);

    expect(status).toBe(403);
  });
});
