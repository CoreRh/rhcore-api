import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { PayrollStatusEnum } from 'src/payroll/enums/payroll-status.enum';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001/api';
const PAYROLL_ENDPOINT = '/payroll';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;
let defaultEmployeeId: string = null!;

export interface PayrollData {
  ID: string;
  FUNCIONARIO: { ID: string; NOME: string; MATRICULA: string };
  MES_REFERENCIA: number;
  ANO_REFERENCIA: number;
  SALARIO_BASE: number;
  BONUS: number;
  DESCONTO_INSS: number;
  DESCONTO_IRRF: number;
  OUTROS_DESCONTOS: number;
  DESCONTO_VT: number;
  SALARIO_LIQUIDO: number;
  STATUS_FOLHA: PayrollStatusEnum;
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

export async function createPayroll(
  overrides?: Partial<{
    FUNCIONARIO_ID: string;
    MES_REFERENCIA: number;
    ANO_REFERENCIA: number;
    SALARIO_BASE: number;
    BONUS: number;
    DESCONTO_INSS: number;
    DESCONTO_IRRF: number;
    OUTROS_DESCONTOS: number;
    VALOR_PASSAGEM: number;
    OBSERVACAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PayrollData> }> {
  const payload = {
    FUNCIONARIO_ID: overrides?.FUNCIONARIO_ID ?? defaultEmployeeId,
    MES_REFERENCIA: overrides?.MES_REFERENCIA ?? 3,
    ANO_REFERENCIA: overrides?.ANO_REFERENCIA ?? 2025,
    SALARIO_BASE: overrides?.SALARIO_BASE ?? 5000,
    ...(overrides?.BONUS !== undefined && { BONUS: overrides.BONUS }),
    ...(overrides?.DESCONTO_INSS !== undefined && {
      DESCONTO_INSS: overrides.DESCONTO_INSS,
    }),
    ...(overrides?.DESCONTO_IRRF !== undefined && {
      DESCONTO_IRRF: overrides.DESCONTO_IRRF,
    }),
    ...(overrides?.OUTROS_DESCONTOS !== undefined && {
      OUTROS_DESCONTOS: overrides.OUTROS_DESCONTOS,
    }),
    ...(overrides?.VALOR_PASSAGEM !== undefined && {
      VALOR_PASSAGEM: overrides.VALOR_PASSAGEM,
    }),
    ...(overrides?.OBSERVACAO && { OBSERVACAO: overrides.OBSERVACAO }),
  };

  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<PayrollData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllPayrolls(authenticated = true): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<PayrollData[]>;
}> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<PayrollData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getPayrollById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PayrollData> }> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<PayrollData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function updatePayroll(
  id: string,
  body: Partial<{
    MES_REFERENCIA: number;
    ANO_REFERENCIA: number;
    SALARIO_BASE: number;
    BONUS: number;
    DESCONTO_INSS: number;
    DESCONTO_IRRF: number;
    OUTROS_DESCONTOS: number;
    VALOR_PASSAGEM: number;
    STATUS_FOLHA: PayrollStatusEnum;
    OBSERVACAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PayrollData> }> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiResponse<PayrollData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function payPayroll(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<PayrollData> }> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}/${id}/pay`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<PayrollData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function deletePayroll(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<null> }> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}/${id}`, {
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

export async function getPayrollSlip(
  id: string,
  authenticated = true,
  token?: string,
): Promise<{ status: number; contentType: string | null }> {
  const response = await fetch(`${BASE_URL}${PAYROLL_ENDPOINT}/${id}/slip`, {
    method: 'GET',
    headers: {
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : authenticated
          ? AuthHelper.getAuthHeader()
          : {}),
    },
  });

  return {
    status: response.status,
    contentType: response.headers.get('content-type'),
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query(
    'DELETE FROM "FOLHA_PAGAMENTO" WHERE "FUNCIONARIO_ID" IN (SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" = $1)',
    ['2025001'],
  );
  await dataSource.query('DELETE FROM "FUNCIONARIOS" WHERE "MATRICULA" = $1', [
    '2025001',
  ]);
}
