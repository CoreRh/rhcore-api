import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(dto: CreatePositionDto, createdBy: string): Promise<Position> {
    const existing = await this.positionRepository.findOne({
      where: { NOME: dto.NOME },
    });

    if (existing) {
      throw new ConflictException('Já existe um cargo com esse nome');
    }

    const position = this.positionRepository.create({
      NOME: dto.NOME,
      DESCRICAO: dto.DESCRICAO ?? null,
      NIVEL: dto.NIVEL ?? null,
      SALARIO_BASE: dto.SALARIO_BASE ?? null,
      CRIADO_POR: createdBy,
      ...(dto.DEPARTAMENTO_ID
        ? { DEPARTAMENTO: { ID: dto.DEPARTAMENTO_ID } as Department }
        : {}),
    });

    const saved = await this.positionRepository.save(position);
    this.logger.log(`Cargo ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      where: { STATUS: BaseEntityStatusEnum.ATIVO },
      relations: ['DEPARTAMENTO'],
    });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { ID: id, STATUS: BaseEntityStatusEnum.ATIVO },
      relations: ['DEPARTAMENTO'],
    });

    if (!position) {
      this.logger.warn(`Cargo ${id} não encontrado`);
      throw new NotFoundException(`Cargo com ID ${id} não encontrado`);
    }

    return position;
  }

  async update(
    id: string,
    dto: UpdatePositionDto,
    updatedBy: string,
  ): Promise<Position> {
    const position = await this.findOne(id);

    if (dto.NOME !== undefined) {
      const conflict = await this.positionRepository.findOne({
        where: { NOME: dto.NOME },
      });
      if (conflict && conflict.ID !== id) {
        throw new ConflictException('Já existe um cargo com esse nome');
      }
      position.NOME = dto.NOME;
    }
    if (dto.DESCRICAO !== undefined) position.DESCRICAO = dto.DESCRICAO ?? null;
    if (dto.NIVEL !== undefined) position.NIVEL = dto.NIVEL ?? null;
    if (dto.SALARIO_BASE !== undefined)
      position.SALARIO_BASE = dto.SALARIO_BASE ?? null;
    if (dto.STATUS !== undefined) position.STATUS = dto.STATUS;
    if (dto.DEPARTAMENTO_ID !== undefined) {
      position.DEPARTAMENTO = dto.DEPARTAMENTO_ID
        ? ({ ID: dto.DEPARTAMENTO_ID } as Department)
        : null;
    }
    position.ATUALIZADO_POR = updatedBy;

    await this.positionRepository.save(position);
    this.logger.log(`Cargo ${id} atualizado por ${updatedBy}`);
    const updated = await this.positionRepository.findOne({
      where: { ID: id },
      relations: ['DEPARTAMENTO'],
    });
    if (!updated)
      throw new NotFoundException(`Cargo com ID ${id} não encontrado`);
    return updated;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const position = await this.findOne(id);
    position.EXCLUIDO_POR = deletedBy;
    await this.positionRepository.softRemove(position);
    this.logger.log(`Cargo ${id} removido por ${deletedBy}`);
  }
}
