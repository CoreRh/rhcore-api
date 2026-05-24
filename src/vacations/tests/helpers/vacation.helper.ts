import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { VacationStatusEnum } from 'src/vacations/enums/vacation-status.enum';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001/api';
const VACATIONS_ENDPOINT = '/vacations';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;
let defaultEmployeeId: string = null!;

export interface VacationData {
  ID: string;
  FUNCIONARIO: { ID: string; NOME: string; MATRICULA: string };
  DATA_INICIO: string;
  DATA_FIM: string;
  DIAS_SOLICITADOS: number;
  STATUS_FERIAS: VacationStatusEnum;
  OBSERVACAO: string | null;
  APROVADO_POR: { ID: string; NOME: string; MATRICULA: string };
  DATA_APROVACAO: string | null;
  CRIADO_POR: string;
  CRIADO_EM: string;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function setupDefaultEmployee(): Promise<string> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...AuthHelper.getAuthHeader(),
    },
    body: JSON.stringify({
      MATRICULA: '2025001',
      NOME: 'João da Silva',
      CPF: '123.456.789-00',
      EMAIL: 'joao.silva@empresa.com.br',
      DATA_NASCIMENTO: '1990-05-20',
      DATA_ADMISSAO: '2025-01-15',
    }),
  });

  const data = await response.json();
  defaultEmployeeId = data.data.ID;
  return defaultEmployeeId;
}

export async function createVacation(
  overrides?: Partial<{
    FUNCIONARIO_ID: string;
    DATA_INICIO: string;
    DATA_FIM: string;
    OBSERVACAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<VacationData> }> {
  const payload = {
    FUNCIONARIO_ID: overrides?.FUNCIONARIO_ID ?? defaultEmployeeId,
    DATA_INICIO: overrides?.DATA_INICIO ?? '2025-07-01',
    DATA_FIM: overrides?.DATA_FIM ?? '2025-07-30',
    ...(overrides?.OBSERVACAO && { OBSERVACAO: overrides.OBSERVACAO }),
  };

  const response = await fetch(`${BASE_URL}${VACATIONS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as ApiResponse<VacationData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllVacations(): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<VacationData[]>;
}> {
  const response = await fetch(`${BASE_URL}${VACATIONS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthHelper.getAuthHeader(),
    },
  });

  const data = (await response.json()) as ApiResponse<VacationData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getVacationById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<VacationData> }> {
  const response = await fetch(`${BASE_URL}${VACATIONS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<VacationData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query('TRUNCATE TABLE "FERIAS" CASCADE');
  await dataSource.query('TRUNCATE TABLE "FUNCIONARIOS" CASCADE');
}
