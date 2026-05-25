import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/common/tests/helpers/api-response.helper';
import { ActivityDataDto } from 'src/dashboard/dto/activity-response.dto';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3001/api';
const DASHBOARD_ENDPOINT = '/dashboard';

let dataSource: DataSource = null!;

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function getActivity(
  authenticated = true,
  token?: string,
): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<ActivityDataDto[]>;
}> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (authenticated) {
    headers['Authorization'] = AuthHelper.getAuthHeader().Authorization;
  }

  const response = await fetch(`${BASE_URL}${DASHBOARD_ENDPOINT}/activity`, {
    method: 'GET',
    headers,
  });

  const data = (await response.json()) as ApiResponse<ActivityDataDto[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query(
    'DELETE FROM "SOLICITACOES" WHERE "FUNCIONARIO_ID" IN (SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1)',
    ['202%'],
  );
  await dataSource.query(
    'DELETE FROM "FERIAS" WHERE "FUNCIONARIO_ID" IN (SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1)',
    ['202%'],
  );
  await dataSource.query(
    'DELETE FROM "FOLHA_PAGAMENTO" WHERE "FUNCIONARIO_ID" IN (SELECT "ID" FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1)',
    ['202%'],
  );
  await dataSource.query(
    'DELETE FROM "FUNCIONARIOS" WHERE "MATRICULA" LIKE $1',
    ['202%'],
  );
}
