import { AuthHelper } from '../../../auth/tests/helpers/auth.helper';
import { User } from '../../../users/entities/user.entity';
import { DataSource } from 'typeorm';
import type { ApiResponse } from '../../../common/tests/helpers/api-response.helper';

const BASE_URL = 'http://localhost:3001';
const USERS_ENDPOINT = '/users';

let dataSource: DataSource;

export interface UserData {
  ID: string;
  NOME_USUARIO: string;
  EMAIL: string;
  STATUS: string;
  CRIADO_EM: string;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createUser(
  overrides?: Partial<{ NOME_USUARIO: string; SENHA: string; EMAIL: string }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<UserData> }> {
  const payload = {
    NOME_USUARIO: overrides?.NOME_USUARIO ?? 'user-test',
    SENHA: overrides?.SENHA ?? 'admin123',
    EMAIL: overrides?.EMAIL ?? 'test@email.com.br',
  };

  const response = await fetch(`${BASE_URL}${USERS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<UserData>;
  return { status: response.status, ok: response.ok, body: data };
}

export async function getAllUsers(): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<UserData[]>;
}> {
  const response = await fetch(`${BASE_URL}${USERS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthHelper.getAuthHeader(),
    },
  });

  const data = (await response.json()) as ApiResponse<UserData[]>;
  return { status: response.status, ok: response.ok, body: data };
}

export async function getUserById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<UserData> }> {
  const response = await fetch(`${BASE_URL}${USERS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<UserData>;
  return { status: response.status, ok: response.ok, body: data };
}

export async function cleanupAll() {
  if (!dataSource)
    throw new Error(
      'DataSource não inicializado. Rode initTestDataSource antes',
    );
  await dataSource
    .getRepository(User)
    .createQueryBuilder()
    .delete()
    .where('NOME_USUARIO != :name', { name: AuthHelper.getUsername() })
    .execute();
}
