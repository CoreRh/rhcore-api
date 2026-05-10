import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { UpdatePositionDto } from 'src/positions/dto/update-position.dto';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001';
const POSITIONS_ENDPOINT = '/positions';

let dataSource: DataSource = null!;

export interface PositionData {
  ID: string;
  NOME: string;
  DESCRICAO: string | null;
  NIVEL: string | null;
  SALARIO_BASE: number | null;
  CRIADO_POR: string;
  CRIADO_EM: string;
  DEPARTAMENTO: {
    ID: string;
    NOME: string;
    SIGLA: string;
  } | null;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createPosition(
  overrides?: Partial<{
    NOME: string;
    DESCRICAO: string;
    NIVEL: string;
    SALARIO_BASE: number;
    DEPARTAMENTO_ID: string;
  }>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PositionData> }> {
  const payload = {
    NOME: overrides?.NOME ?? 'Desenvolvedor Junior',
    DESCRICAO: overrides?.DESCRICAO,
    NIVEL: overrides?.NIVEL,
    SALARIO_BASE: overrides?.SALARIO_BASE,
    DEPARTAMENTO_ID: overrides?.DEPARTAMENTO_ID,
  };

  const response = await fetch(`${BASE_URL}${POSITIONS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated
        ? { Authorization: `Bearer ${token ?? AuthHelper.getAccessToken()}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  return {
    status: response.status,
    ok: response.ok,
    body: await response.json(),
  };
}

export async function getAllPositions(
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PositionData[]> }> {
  const response = await fetch(`${BASE_URL}${POSITIONS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated
        ? { Authorization: `Bearer ${token ?? AuthHelper.getAccessToken()}` }
        : {}),
    },
  });

  return {
    status: response.status,
    ok: response.ok,
    body: await response.json(),
  };
}

export async function getPositionById(
  id: string,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PositionData> }> {
  const response = await fetch(`${BASE_URL}${POSITIONS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated
        ? { Authorization: `Bearer ${token ?? AuthHelper.getAccessToken()}` }
        : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<PositionData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function updatePosition(
  id: string,
  body: Partial<UpdatePositionDto>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PositionData> }> {
  const response = await fetch(`${BASE_URL}${POSITIONS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated
        ? { Authorization: `Bearer ${token ?? AuthHelper.getAccessToken()}` }
        : {}),
    },
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    ok: response.ok,
    body: await response.json(),
  };
}

export async function deletePosition(
  id: string,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<null> }> {
  const response = await fetch(`${BASE_URL}${POSITIONS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated
        ? { Authorization: `Bearer ${token ?? AuthHelper.getAccessToken()}` }
        : {}),
    },
  });
  return {
    status: response.status,
    ok: response.ok,
    body: await response.json(),
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Datasource não inicializado');
  await dataSource.query('TRUNCATE TABLE "CARGOS" CASCADE');
}
