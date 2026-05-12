import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createBenefit,
  initTestDataSource,
  setupDefaultEmployee,
  updateBenefit,
} from './helpers/benefit.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { BeneficioStatusEnum } from '../enums/beneficio-status.enum';

describe('PATCH /benefits/:id', () => {
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

  it('deve atualizar benefício com sucesso (200)', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const { status, body } = await updateBenefit(id, {
      VALOR: 600.0,
      STATUS_BENEFICIO: BeneficioStatusEnum.INATIVO,
      OBSERVACAO: 'Benefício suspenso temporariamente',
    });

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.VALOR).toBe(600);
    expect(body.data?.STATUS_BENEFICIO).toBe('INATIVO');
    expect(body.message).toBe('Benefício atualizado com sucesso.');
  });

  it('deve retornar 400 quando STATUS_BENEFICIO é inválido', async () => {
    const created = await createBenefit();
    const id = created.body.data!.ID;

    const { status, body } = await updateBenefit(id, {
      STATUS_BENEFICIO: 'STATUS_INVALIDO' as BeneficioStatusEnum,
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 404 quando benefício não existe', async () => {
    const { status, body } = await updateBenefit(
      '00000000-0000-0000-0000-000000000000',
      { VALOR: 600 },
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await updateBenefit(
      '00000000-0000-0000-0000-000000000000',
      { VALOR: 600 },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
