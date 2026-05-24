import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enums/user-role.enum';

const TEST_BASE_URL = 'http://localhost:3001/api';

interface AuthResponse {
  succeeded: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    role: string;
  };
  message: string;
}

export class AuthHelper {
  private static readonly username = 'admin';
  private static accessToken: string;
  private static refreshToken: string;

  static async createSessionAs(
    dataSource: DataSource,
    username: string,
    role: UserRole = UserRole.EMPLOYEE,
  ): Promise<string> {
    const repo = dataSource.getRepository(User);
    const exists = await repo.findOne({ where: { NOME_USUARIO: username } });

    if (!exists) {
      const user = repo.create({
        NOME_USUARIO: username,
        SENHA: await bcrypt.hash('senha123', 10),
        EMAIL: `${username}@test.com.br`,
        CRIADO_POR: 'test',
        ROLE: role,
      });
      await repo.save(user);
    }

    const response = await fetch(`${TEST_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: 'senha123' }),
    });

    const data = (await response.json()) as AuthResponse;
    return data.data.access_token;
  }

  static async setup(dataSource: DataSource) {
    const repo = dataSource.getRepository(User);

    const exists = await repo.findOne({
      where: { NOME_USUARIO: this.username },
    });

    if (!exists) {
      const user = repo.create({
        NOME_USUARIO: this.username,
        SENHA: await bcrypt.hash('admin123', 10),
        EMAIL: 'admin@admin.com.br',
        CRIADO_POR: 'test',
        ROLE: UserRole.ADMIN,
      });
      await repo.save(user);
    } else if (exists.ROLE !== UserRole.ADMIN) {
      await repo.update(exists.ID, { ROLE: UserRole.ADMIN });
    }

    await this.authenticate();
  }

  static async authenticate() {
    const response = await fetch(`${TEST_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: 'admin123' }),
    });

    if (!response.ok)
      throw new Error(`Falha ao autenticar: ${response.status}`);

    const data = (await response.json()) as AuthResponse;
    this.accessToken = data.data.access_token;
    this.refreshToken = data.data.refresh_token;

    if (!this.accessToken) throw new Error('Nenhum access token retornado');
    if (!this.refreshToken) throw new Error('Nenhum refresh token retornado');
  }

  static getAccessToken() {
    if (!this.accessToken) throw new Error('Usuário não autenticado');
    return this.accessToken;
  }

  static getAuthHeader() {
    if (!this.accessToken) throw new Error('Usuário não autenticado');
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  static getRefreshHeader() {
    if (!this.refreshToken) throw new Error('Refresh token não encontrado');
    return { Authorization: `Bearer ${this.refreshToken}` };
  }

  static getRefreshToken() {
    if (!this.refreshToken) throw new Error('Refresh token não disponível');
    return this.refreshToken;
  }

  static getUsername() {
    return this.username;
  }
}
