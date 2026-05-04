import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(dto: CreateUserDto, createdBy: string): Promise<User> {
    const { FUNCIONARIO_ID, ...rest } = dto;

    let email = rest.EMAIL;

    if (FUNCIONARIO_ID) {
      const employee = await this.findEmployeeOrFail(FUNCIONARIO_ID);
      email = email ?? employee.EMAIL;
    }

    if (!email) {
      throw new BadRequestException(
        'Informe o e-mail ou vincule um funcionário.',
      );
    }

    const hashed = await bcrypt.hash(rest.SENHA, 10);
    const user = this.usersRepository.create({
      ...rest,
      EMAIL: email,
      SENHA: hashed,
      CRIADO_POR: createdBy,
      FUNCIONARIO_ID: FUNCIONARIO_ID ?? null,
    });

    try {
      const saved = await this.usersRepository.save(user);
      this.logger.log(`Usuário ${saved.ID} criado por ${createdBy}`);
      return saved;
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { code: string }).code === '23505'
      ) {
        throw new ConflictException('Já existe um usuário com esse e-mail.');
      }
      throw err;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'ID',
        'NOME_USUARIO',
        'EMAIL',
        'STATUS',
        'ROLE',
        'PERMISSIONS',
        'FUNCIONARIO_ID',
        'CRIADO_POR',
        'CRIADO_EM',
        'ATUALIZADO_POR',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { ID: id },
      select: [
        'ID',
        'NOME_USUARIO',
        'EMAIL',
        'STATUS',
        'ROLE',
        'PERMISSIONS',
        'FUNCIONARIO_ID',
        'CRIADO_POR',
        'CRIADO_EM',
        'ATUALIZADO_POR',
      ],
    });
    if (!user) {
      this.logger.warn(`Usuário ${id} não encontrado`);
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    updatedBy?: string,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (dto.FUNCIONARIO_ID) {
      await this.findEmployeeOrFail(dto.FUNCIONARIO_ID);
    }

    const updateData = { ...dto };
    if (updateData.SENHA) {
      updateData.SENHA = await bcrypt.hash(updateData.SENHA, 10);
    }

    Object.assign(user, updateData);

    if (updatedBy) {
      user.ATUALIZADO_POR = updatedBy;
    }

    const saved = await this.usersRepository.save(user);
    this.logger.log(`Usuário ${id} atualizado por ${updatedBy ?? 'sistema'}`);
    return saved;
  }

  async remove(id: string, deletedBy?: string): Promise<void> {
    const user = await this.findOne(id);

    user.EXCLUIDO_POR = deletedBy ?? 'sistema';
    await this.usersRepository.softRemove(user);
    this.logger.log(`Usuário ${id} removido por ${deletedBy ?? 'sistema'}`);
  }

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { NOME_USUARIO: username },
    });

    if (!user) {
      this.logger.warn(
        `Tentativa de login com usuário inexistente: ${username}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.SENHA);

    if (!passwordMatch) {
      this.logger.warn(`Senha incorreta para o usuário: ${username}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  async findForAuth(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { ID: userId } });

    if (!user) {
      this.logger.warn(`Usuário ${userId} não encontrado para autenticação`);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.usersRepository.update(userId, { REFRESH_TOKEN: refreshToken });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { EMAIL: email } });
  }

  async saveResetToken(
    userId: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      RESET_PASSWORD_TOKEN: token,
      RESET_PASSWORD_EXPIRES: expires,
    });
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      RESET_PASSWORD_TOKEN: null,
      RESET_PASSWORD_EXPIRES: null,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { RESET_PASSWORD_TOKEN: token },
    });
  }

  private findEmployeeOrFail(employeeId: string): Promise<Employee> {
    return this.employeesService.findOne(employeeId);
  }
}
