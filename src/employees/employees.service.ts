import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Department } from 'src/departments/entities/department.entity';
import { Position } from 'src/positions/entities/position.entity';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(dto: CreateEmployeeDto, createdBy: string): Promise<Employee> {
    const existing = await this.employeeRepository.findOne({
      where: [
        { MATRICULA: dto.MATRICULA },
        { CPF: dto.CPF },
        { EMAIL: dto.EMAIL },
      ],
    });

    if (existing) {
      if (existing.MATRICULA === dto.MATRICULA) {
        throw new ConflictException(
          'Já existe um funcionário com essa matrícula',
        );
      }
      if (existing.CPF === dto.CPF) {
        throw new ConflictException('Já existe um funcionário com esse CPF');
      }
      throw new ConflictException('Já existe um funcionário com esse e-mail');
    }

    if (dto.DEPARTAMENTO_ID) {
      const dept = await this.departmentRepository.findOne({
        where: { ID: dto.DEPARTAMENTO_ID },
      });
      if (!dept)
        throw new NotFoundException(
          `Departamento com ID ${dto.DEPARTAMENTO_ID} não encontrado`,
        );
    }
    if (dto.CARGO_ID) {
      const position = await this.positionRepository.findOne({
        where: { ID: dto.CARGO_ID },
      });
      if (!position)
        throw new NotFoundException(
          `Cargo com o ID ${dto.CARGO_ID} não encontrado`,
        );
    }
    if (dto.GESTOR_ID) {
      const manager = await this.employeeRepository.findOne({
        where: { ID: dto.GESTOR_ID },
      });
      if (!manager)
        throw new NotFoundException(
          `Gestor com ID ${dto.CARGO_ID} não encontrado`,
        );
    }

    const employee = this.employeeRepository.create({
      MATRICULA: dto.MATRICULA,
      NOME: dto.NOME,
      CPF: dto.CPF,
      RG: dto.RG ?? null,
      DATA_NASCIMENTO: new Date(dto.DATA_NASCIMENTO),
      EMAIL: dto.EMAIL,
      TELEFONE: dto.TELEFONE ?? null,
      DATA_ADMISSAO: new Date(dto.DATA_ADMISSAO),
      CRIADO_POR: createdBy,
      ...(dto.DEPARTAMENTO_ID
        ? { DEPARTAMENTO: { ID: dto.DEPARTAMENTO_ID } as Department }
        : {}),
      ...(dto.CARGO_ID ? { CARGO: { ID: dto.CARGO_ID } as Position } : {}),
      ...(dto.GESTOR_ID ? { GESTOR: { ID: dto.GESTOR_ID } as Employee } : {}),
    });

    let saved: Employee;
    try {
      saved = await this.employeeRepository.save(employee);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new ConflictException('Já existe um funcionário com esses dados');
      }
      throw err;
    }
    this.logger.log(`Funcionário ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: ['DEPARTAMENTO', 'CARGO', 'GESTOR'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { ID: id },
      relations: ['DEPARTAMENTO', 'CARGO', 'GESTOR'],
    });

    if (!employee) {
      this.logger.warn(`Funcionário ${id} não encontrado`);
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
    }

    return employee;
  }

  async update(
    id: string,
    dto: UpdateEmployeeDto,
    updatedBy: string,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (dto.DEPARTAMENTO_ID) {
      const dept = await this.departmentRepository.findOne({
        where: { ID: dto.DEPARTAMENTO_ID },
      });
      if (!dept)
        throw new NotFoundException(
          `Departamento com ID ${dto.DEPARTAMENTO_ID} não encontrado`,
        );
    }
    if (dto.CARGO_ID) {
      const position = await this.positionRepository.findOne({
        where: { ID: dto.CARGO_ID },
      });
      if (!position)
        throw new NotFoundException(
          `Cargo com ID ${dto.CARGO_ID} não encontrado`,
        );
    }
    if (dto.GESTOR_ID) {
      const manager = await this.employeeRepository.findOne({
        where: { ID: dto.GESTOR_ID },
      });
      if (!manager)
        throw new NotFoundException(
          `Gestor com o ID ${dto.GESTOR_ID} não encontrado`,
        );
    }

    Object.assign(employee, {
      ...(dto.MATRICULA !== undefined && { MATRICULA: dto.MATRICULA }),
      ...(dto.NOME !== undefined && { NOME: dto.NOME }),
      ...(dto.CPF !== undefined && { CPF: dto.CPF }),
      ...(dto.RG !== undefined && { RG: dto.RG }),
      ...(dto.EMAIL !== undefined && { EMAIL: dto.EMAIL }),
      ...(dto.TELEFONE !== undefined && { TELEFONE: dto.TELEFONE }),
      ...(dto.STATUS !== undefined && { STATUS: dto.STATUS }),
      ...(dto.DATA_NASCIMENTO !== undefined && {
        DATA_NASCIMENTO: new Date(dto.DATA_NASCIMENTO),
      }),
      ...(dto.DATA_ADMISSAO !== undefined && {
        DATA_ADMISSAO: new Date(dto.DATA_ADMISSAO),
      }),
      DEPARTAMENTO: dto.DEPARTAMENTO_ID
        ? ({ ID: dto.DEPARTAMENTO_ID } as Department)
        : employee.DEPARTAMENTO,
      CARGO: dto.CARGO_ID ? ({ ID: dto.CARGO_ID } as Position) : employee.CARGO,
      GESTOR: dto.GESTOR_ID
        ? ({ ID: dto.GESTOR_ID } as Employee)
        : employee.GESTOR,
      ATUALIZADO_POR: updatedBy,
    });

    let saved: Employee;
    try {
      saved = await this.employeeRepository.save(employee);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new ConflictException(
          'Matrícula, CPF ou e-mail já cadastrado em outro funcionário',
        );
      }
      throw err;
    }
    this.logger.log(`Funcionário ${id} atualizado por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    this.logger.log(`Funcionário ${id} removido por ${deletedBy}`);
  }
}
