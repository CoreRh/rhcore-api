import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { RequestStatusEnum } from 'src/requests/enums/request-status.enum';
import { RequestTypeEnum } from 'src/requests/enums/request-type.enum';
import { DataSource } from 'typeorm';

export const BASE_URL = 'http://localhost:3001/api';
const REQUEST_ENDPOINT = '/requests';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;
let defaultEmployeeId: string = null!;

export interface RequestData {
  ID: string;
  FUNCIONARIO: { ID: string; NOME: string; MATRICULA: string };
  TIPO: RequestTypeEnum;
  DESCRICAO: string;
  OBSERVACAO: string | null;
  DATA_SOLICITACAO: string;
  DATA_RESPOSTA: string | null;
  APROVADO_POR: { ID: string; NOME_USUARIO: string; EMAIL: string } | null;
  CRIADO_POR: string;
  CRIADO_EM: string;
  SITUACAO: RequestStatusEnum;
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
      NOME: 'João da silva',
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

export async function createRequest(
  overrides?: Partial<{
    FUNCIONARIO_ID: string;
    TIPO: RequestTypeEnum;
    DESCRICAO: string;
    DATA_SOLICITACAO: string;
    OBSERVACAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<RequestData> }> {
  const payload = {
    FUNCIONARIO_ID: overrides?.FUNCIONARIO_ID ?? defaultEmployeeId,
    TIPO: overrides?.TIPO ?? RequestTypeEnum.DOCUMENTO,
    DESCRICAO:
      overrides?.DESCRICAO ??
      'Solicitação de declaração de vínculo empregatício',
    DATA_SOLICITACAO: overrides?.DATA_SOLICITACAO ?? '2025-07-30',
    ...(overrides?.OBSERVACAO && { OBSERVACAO: overrides.OBSERVACAO }),
  };

  const response = await fetch(`${BASE_URL}${REQUEST_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<RequestData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllRequests(authenticated = true): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<RequestData[]>;
}> {
  const response = await fetch(`${BASE_URL}${REQUEST_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<RequestData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getRequestById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<RequestData> }> {
  const response = await fetch(`${BASE_URL}${REQUEST_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<RequestData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function approveRequest(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<RequestData> }> {
  const response = await fetch(`${BASE_URL}${REQUEST_ENDPOINT}/${id}/approve`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<RequestData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query('TRUNCATE TABLE "SOLICITACOES" CASCADE');
  await dataSource.query('TRUNCATE TABLE "FUNCIONARIOS" CASCADE');
}
