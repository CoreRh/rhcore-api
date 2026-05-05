import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RequestStatusEnum } from './enums/request-status.enum';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/types/auth-user.type';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async create(dto: CreateRequestDto, createdBy: string): Promise<Request> {
    const request = this.requestRepository.create({
      FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      TIPO: dto.TIPO,
      DESCRICAO: dto.DESCRICAO,
      DATA_SOLICITACAO: new Date(dto.DATA_SOLICITACAO),
      OBSERVACAO: dto.OBSERVACAO ?? null,
      CRIADO_POR: createdBy,
    });

    const saved = await this.requestRepository.save(request);
    this.logger.log(`Solicitação ${saved.ID} criada por ${createdBy}`);
    return saved;
  }

  async findAll(user: AuthUser): Promise<Request[]> {
    const query = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.FUNCIONARIO', 'FUNCIONARIO')
      .leftJoinAndSelect('request.APROVADO_POR', 'APROVADO_POR');

    if (
      user.role === UserRole.EMPLOYEE &&
      !user.permissions.includes(UserPermission.APPROVE_REQUESTS)
    ) {
      query.andWhere('request.FUNCIONARIO_ID = :id', {
        id: user.funcionario_id,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { ID: id },
      relations: ['FUNCIONARIO', 'APROVADO_POR'],
    });

    if (!request) {
      this.logger.warn(`Solicitação ${id} não encontrada`);
      throw new NotFoundException(`Solicitação com ID ${id} não encontrada`);
    }

    return request;
  }

  async update(
    id: string,
    dto: UpdateRequestDto,
    user: AuthUser,
  ): Promise<Request> {
    const request = await this.findOne(id);

    const isOwner = request.FUNCIONARIO.ID === user.funcionario_id;
    const canManageAll =
      user.role !== UserRole.EMPLOYEE ||
      user.permissions.includes(UserPermission.APPROVE_REQUESTS);

    if (!isOwner && !canManageAll) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta solicitação',
      );
    }

    Object.assign(request, {
      ...(dto.TIPO !== undefined && { TIPO: dto.TIPO }),
      ...(dto.DESCRICAO !== undefined && { DESCRICAO: dto.DESCRICAO }),
      ...(dto.OBSERVACAO !== undefined && { OBSERVACAO: dto.OBSERVACAO }),
      ...(dto.DATA_RESPOSTA !== undefined && {
        DATA_RESPOSTA: new Date(dto.DATA_RESPOSTA),
      }),
      ATUALIZADO_POR: user.username,
    });

    this.logger.log(`Solicitação ${id} atualizada por ${user.username}`);
    return this.requestRepository.save(request);
  }

  async approve(
    id: string,
    approverId: string,
    approvedBy: string,
  ): Promise<Request> {
    const request = await this.findOne(id);

    if (request.SITUACAO === RequestStatusEnum.APROVADO) {
      throw new ConflictException('Esta solicitação já foi aprovada.');
    }

    Object.assign(request, {
      SITUACAO: RequestStatusEnum.APROVADO,
      APROVADO_POR: { ID: approverId } as User,
      DATA_RESPOSTA: new Date(),
      ATUALIZADO_POR: approvedBy,
    });

    this.logger.log(`Solicitação ${id} aprovada por ${approvedBy}`);
    return this.requestRepository.save(request);
  }

  async remove(id: string, user: AuthUser): Promise<void> {
    const request = await this.findOne(id);

    const isOwner = request.FUNCIONARIO?.ID === user.funcionario_id;
    const canManageAll =
      user.role !== UserRole.EMPLOYEE ||
      user.permissions.includes(UserPermission.APPROVE_REQUESTS);

    if (!isOwner && !canManageAll) {
      throw new ForbiddenException(
        'Sem permissão para alterar esta solicitação',
      );
    }
    await this.requestRepository.remove(request);
    this.logger.log(`Solicitação ${id} removida por ${user.username}`);
  }
}
