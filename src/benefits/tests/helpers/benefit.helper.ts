import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { BeneficioStatusEnum } from 'src/benefits/enums/beneficio-status.enum';
import { BeneficioTipoEnum } from 'src/benefits/enums/beneficio-tipo.enum';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001';
const BENEFITS_ENDPOINT = '/benefits';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;
let defaultEmployeeId: string = null!;

export interface BenefitData {
  ID: string;
  FUNCIONARIO: { ID: string; NOME: string; MATRICULA: string };
  TIPO: BeneficioTipoEnum;
  DESCRICAO: string | null;
  VALOR: number;
  METADADOS: Record<string, unknown> | null;
  DATA_INICIO: string;
  DATA_FIM: string | null;
  STATUS_BENEFICIO: BeneficioStatusEnum;
  OBSERVACAO: string | null;
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
      STATUS: 'ATIVO',
    }),
  });

  if (response.status === 409) {
    const result = await dataSource.query(
      'SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" = $1',
      ['2025001'],
    );
    defaultEmployeeId = result[0]?.ID;
  } else {
    const data = await response.json();
    defaultEmployeeId = data.data.ID;
  }
  return defaultEmployeeId;
}

export async function createBenefit(
  overrides?: Partial<{
    FUNCIONARIO_ID: string;
    TIPO: BeneficioTipoEnum;
    VALOR: number;
    METADADOS: Record<string, unknown> | null;
    DATA_INICIO: string;
    DATA_FIM: string;
    DESCRICAO: string;
    OBSERVACAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<BenefitData> }> {
  const payload = {
    FUNCIONARIO_ID: overrides?.FUNCIONARIO_ID ?? defaultEmployeeId,
    TIPO: overrides?.TIPO ?? BeneficioTipoEnum.VALE_REFEICAO,
    DATA_INICIO: overrides?.DATA_INICIO ?? '2025-01-01',
    METADADOS:
      overrides?.METADADOS !== undefined
        ? overrides.METADADOS
        : { VALOR_DIARIO: 25, DIAS_UTEIS: 20 },
    ...(overrides?.VALOR !== undefined && { VALOR: overrides.VALOR }),
    ...(overrides?.DATA_FIM && { DATA_FIM: overrides.DATA_FIM }),
    ...(overrides?.DESCRICAO && { DESCRICAO: overrides.DESCRICAO }),
    ...(overrides?.OBSERVACAO && { OBSERVACAO: overrides.OBSERVACAO }),
  };

  const response = await fetch(`${BASE_URL}${BENEFITS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<BenefitData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllBenefits(authenticated = true): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<BenefitData[]>;
}> {
  const response = await fetch(`${BASE_URL}${BENEFITS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<BenefitData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getBenefitsByEmployee(
  funcionarioId: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<BenefitData[]> }> {
  const response = await fetch(
    `${BASE_URL}${BENEFITS_ENDPOINT}/employee/${funcionarioId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authenticated ? AuthHelper.getAuthHeader() : {}),
      },
    },
  );

  const data = (await response.json()) as ApiResponse<BenefitData[]>;
  return { status: response.status, ok: response.ok, body: data };
}

export async function getBenefitById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<BenefitData> }> {
  const response = await fetch(`${BASE_URL}${BENEFITS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<BenefitData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function updateBenefit(
  id: string,
  body: Partial<{
    TIPO: BeneficioTipoEnum;
    VALOR: number;
    METADADOS: Record<string, unknown> | null;
    DATA_INICIO: string;
    DATA_FIM: string | null;
    DESCRICAO: string;
    OBSERVACAO: string;
    STATUS_BENEFICIO: BeneficioStatusEnum;
  }>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<BenefitData> }> {
  const response = await fetch(`${BASE_URL}${BENEFITS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : authenticated
          ? AuthHelper.getAuthHeader()
          : {}),
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as ApiResponse<BenefitData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function deleteBenefit(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<null> }> {
  const response = await fetch(`${BASE_URL}${BENEFITS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<null>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query(
    'DELETE FROM "BENEFICIOS" WHERE "FUNCIONARIO_ID" IN (SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" = $1)',
    ['2025001'],
  );
  await dataSource.query('DELETE FROM "FUNCIONARIOS" WHERE "MATRICULA" = $1', [
    '2025001',
  ]);
}
