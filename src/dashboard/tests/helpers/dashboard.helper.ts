import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001/api';
const DASHBOARD_ENDPOINT = '/dashboard';

let dataSource: DataSource = null!;

export interface ActivityData {
  ID: string;
  TIPO: 'FUNCIONARIO' | 'FERIAS' | 'SOLICITACAO';
  TITULO: string;
  DESCRICAO: string;
  STATUS: string | null;
  CRIADO_EM: string;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function getActivity(authenticated = true): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<ActivityData[]>;
}> {
  const response = await fetch(`${BASE_URL}${DASHBOARD_ENDPOINT}/activity`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<ActivityData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query('TRUNCATE TABLE "SOLICITACOES" CASCADE');
  await dataSource.query('TRUNCATE TABLE "FERIAS" CASCADE');
  await dataSource.query(
    'DELETE FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1',
    ['2025%'],
  );
}
