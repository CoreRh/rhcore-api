import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;

export interface EmployeeData {
  ID: string;
  MATRICULA: string;
  NOME: string;
  CPF: string;
  RG: string | null;
  DATA_NASCIMENTO: string;
  EMAIL: string;
  TELEFONE: string | null;
  DATA_ADMISSAO: string;
  CRIADO_POR: string;
  CRIADO_EM: string;
  DEPARTAMENTO: { ID: string; NOME: string } | null;
  CARGO: { ID: string; NOME: string } | null;
  GESTOR: { ID: string; NOME: string; MATRICULA: string } | null;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createEmployee(
  overrides?: Partial<{
    MATRICULA: string;
    NOME: string;
    CPF: string;
    EMAIL: string;
    DATA_NASCIMENTO: string;
    DATA_ADMISSAO: string;
    DEPARTAMENTO_ID: string;
    CARGO_ID: string;
    GESTOR_ID: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData> }> {
  const payload = {
    MATRICULA: overrides?.MATRICULA ?? '2025001',
    NOME: overrides?.NOME ?? 'João da Silva',
    CPF: overrides?.CPF ?? '123.456.789-00',
    EMAIL: overrides?.EMAIL ?? 'joao.silva@empresa.com.br',
    DATA_NASCIMENTO: overrides?.DATA_NASCIMENTO ?? '1990-05-20',
    DATA_ADMISSAO: overrides?.DATA_ADMISSAO ?? '2025-01-15',
    ...(overrides?.DEPARTAMENTO_ID && {
      DEPARTAMENTO_ID: overrides.DEPARTAMENTO_ID,
    }),
    ...(overrides?.CARGO_ID && { CARGO_ID: overrides.CARGO_ID }),
    ...(overrides?.GESTOR_ID && { GESTOR_ID: overrides.GESTOR_ID }),
  };

  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<EmployeeData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllEmployees(
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData[]> }> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<EmployeeData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getEmployeeById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData> }> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<EmployeeData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function updateEmployee(
  id: string,
  dto: Partial<{
    NOME: string;
    CPF: string;
    EMAIL: string;
    MATRICULA: string;
    DATA_NASCIMENTO: string;
    DATA_ADMISSAO: string;
    DEPARTAMENTO_ID: string;
    CARGO_ID: string;
    GESTOR_ID: string;
  }>,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData> }> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}/${id}`, {
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

  const data = (await response.json()) as ApiResponse<EmployeeData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function deleteEmployee(
  id: string,
  authenticated = true,
  token?: string,
): Promise<{ status: number; ok: boolean; body: ApiResponse<null> }> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}/${id}`, {
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
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query(
    'DELETE FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1',
    ['2025%'],
  );
}
