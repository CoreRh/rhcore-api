import { AuthHelper } from '../../../auth/tests/helpers/auth.helper';
import { ApiResponse } from '../../../common/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001';
const DEPARTMENTS_ENDPOINT = '/departments';

let dataSource: DataSource = null!;

export interface DepartmentData {
  ID: string;
  NOME: string;
  SIGLA: string;
  DESCRICAO: string | null;
  CRIADO_POR: string;
  CRIADO_EM: string;
  DEPARTAMENTO_PAI: DepartmentData | null;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createDepartment(
  overrides?: Partial<{
    NOME: string;
    SIGLA: string;
    DESCRICAO: string;
    DEPARTAMENTO_PAI_ID: string;
  }>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<DepartmentData> }> {
  const payload = {
    NOME: overrides?.NOME ?? 'Tecnologia da informação',
    SIGLA: overrides?.SIGLA ?? 'TEST_TI',
    DESCRICAO: overrides?.DESCRICAO,
    ...(overrides?.DEPARTAMENTO_PAI_ID && {
      DEPARTAMENTO_PAI_ID: overrides.DEPARTAMENTO_PAI_ID,
    }),
  };

  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : authenticated
          ? AuthHelper.getAuthHeader()
          : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<DepartmentData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllDepartments(authenticated = true): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<DepartmentData[]>;
}> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });
  const data = (await response.json()) as ApiResponse<DepartmentData[]>;
  return { status: response.status, ok: response.ok, body: data };
}

export async function getDepartmentsById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<DepartmentData> }> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<DepartmentData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function updateDepartment(
  id: string,
  dto: Partial<{
    NOME: string;
    SIGLA: string;
    DESCRICAO: string;
    DEPARTAMENTO_PAI_ID: string;
  }>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<DepartmentData> }> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : authenticated
          ? AuthHelper.getAuthHeader()
          : {}),
    },
    body: JSON.stringify(dto),
  });
  const data = (await response.json()) as ApiResponse<DepartmentData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function deleteDepartment(
  id: string,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<null> }> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : authenticated
          ? AuthHelper.getAuthHeader()
          : {}),
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
  if (!dataSource) throw new Error('Datasource não inicializado');
  await dataSource.query(`DELETE FROM "DEPARTAMENTOS" WHERE "SIGLA" LIKE $1`, [
    'TEST_%',
  ]);
}
