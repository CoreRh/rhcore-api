import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(
    dto: CreateDepartmentDto,
    createdBy: string,
  ): Promise<Department> {
    const existing = await this.departmentRepository.findOne({
      where: [{ NOME: dto.NOME }, { SIGLA: dto.SIGLA }],
    });

    if (existing) {
      if (existing.NOME === dto.NOME)
        throw new ConflictException('Já existe um departamento com esse nome');
      throw new ConflictException('Já existe um departamento com essa sigla');
    }

    if (dto.DEPARTAMENTO_PAI_ID) {
      const parent = await this.departmentRepository.findOne({
        where: { ID: dto.DEPARTAMENTO_PAI_ID },
      });
      if (!parent)
        throw new NotFoundException(
          `Departamento pai com ID ${dto.DEPARTAMENTO_PAI_ID} não encontrado`,
        );
    }

    const department = this.departmentRepository.create({
      NOME: dto.NOME,
      SIGLA: dto.SIGLA,
      DESCRICAO: dto.DESCRICAO ?? null,
      CRIADO_POR: createdBy,
      ...(dto.DEPARTAMENTO_PAI_ID
        ? { DEPARTAMENTO_PAI: { ID: dto.DEPARTAMENTO_PAI_ID } as Department }
        : {}),
    });

    let saved: Department;
    try {
      saved = await this.departmentRepository.save(department);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'Já existe um departamento com esse nome ou sigla',
        );
      }
      throw err;
    }
    this.logger.log(`Departamento ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['DEPARTAMENTO_PAI'],
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { ID: id },
      relations: ['DEPARTAMENTO_PAI'],
    });

    if (!department) {
      this.logger.warn(`Departamento ${id} não encontrado`);
      throw new NotFoundException(`Departamento com ID ${id} não encontrado`);
    }

    return department;
  }

  async update(
    id: string,
    dto: UpdateDepartmentDto,
    updatedBy: string,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (dto.NOME !== undefined || dto.SIGLA !== undefined) {
      const conflicting = await this.departmentRepository.findOne({
        where: [
          ...(dto.NOME !== undefined ? [{ NOME: dto.NOME }] : []),
          ...(dto.SIGLA !== undefined ? [{ SIGLA: dto.SIGLA }] : []),
        ],
      });
      if (conflicting && conflicting.ID !== id) {
        if (dto.NOME !== undefined && conflicting.NOME === dto.NOME)
          throw new ConflictException(
            'Já existe um departamento com esse nome',
          );
        throw new ConflictException('Já existe um departamento com essa sigla');
      }
    }

    if (dto.DEPARTAMENTO_PAI_ID) {
      if (dto.DEPARTAMENTO_PAI_ID === id)
        throw new BadRequestException(
          'Um departamento não pode ser seu próprio pai',
        );
      const parent = await this.departmentRepository.findOne({
        where: { ID: dto.DEPARTAMENTO_PAI_ID },
      });
      if (!parent)
        throw new NotFoundException(
          `Departamento pai com ID ${dto.DEPARTAMENTO_PAI_ID} não encontrado`,
        );
    }

    Object.assign(department, {
      ...(dto.NOME !== undefined && { NOME: dto.NOME }),
      ...(dto.SIGLA !== undefined && { SIGLA: dto.SIGLA }),
      ...(dto.DESCRICAO !== undefined && { DESCRICAO: dto.DESCRICAO }),
      ...(dto.STATUS !== undefined && { STATUS: dto.STATUS }),
      DEPARTAMENTO_PAI: dto.DEPARTAMENTO_PAI_ID
        ? ({ ID: dto.DEPARTAMENTO_PAI_ID } as Department)
        : department.DEPARTAMENTO_PAI,
      ATUALIZADO_POR: updatedBy,
    });

    let saved: Department;
    try {
      saved = await this.departmentRepository.save(department);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new ConflictException(
          'Nome ou sigla já cadastrado em outro departamento',
        );
      }
      throw err;
    }
    this.logger.log(`Departamento ${id} atualizado por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const departament = await this.findOne(id);
    await this.departmentRepository.remove(departament);
    this.logger.log(`Departamento ${id} removido por ${deletedBy}`);
  }
}
