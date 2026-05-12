import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Benefit } from './entities/benefit.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';
import { AuthUser } from 'src/auth/types/auth-user.type';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserPermission } from 'src/common/enums/user-permission.enum';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { BeneficioTipoEnum } from './enums/beneficio-tipo.enum';
import {
  ValeRefeicaoMetadadosDto,
  ValeTransporteMetadadosDto,
} from './dto/benefit-metadata.dto';
import { BenefitMetadata } from './types/benefit-metadata.types';

@Injectable()
export class BenefitsService {
  private readonly logger = new Logger(BenefitsService.name);

  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  private calculateValue(
    tipo: BeneficioTipoEnum,
    metadados: unknown,
    valorInformado?: number,
  ): number {
    if (tipo === BeneficioTipoEnum.VALE_TRANSPORTE) {
      const m = metadados as ValeTransporteMetadadosDto;
      return Number(
        (m.VALOR_PASSAGEM * m.QUANTIDADE_DIARIA * m.DIAS_UTEIS).toFixed(2),
      );
    }
    if (tipo === BeneficioTipoEnum.VALE_REFEICAO) {
      const m = metadados as ValeRefeicaoMetadadosDto;
      return Number((m.VALOR_DIARIO * m.DIAS_UTEIS).toFixed(2));
    }
    if (!valorInformado) {
      throw new BadRequestException(
        'O valor é obrigatório para este tipo de benefício',
      );
    }
    return valorInformado;
  }

  async create(dto: CreateBenefitDto, createdBy: string): Promise<Benefit> {
    const employee = await this.employeeRepository.findOne({
      where: { ID: dto.FUNCIONARIO_ID },
    });

    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${dto.FUNCIONARIO_ID} não encontrado`,
      );
    }

    if (employee.STATUS !== BaseEntityStatusEnum.ATIVO) {
      throw new BadRequestException(
        'Não é possível adicionar benefício a um funcionário inativo',
      );
    }

    const valor = this.calculateValue(dto.TIPO, dto.METADADOS, dto.VALOR);

    const benefit = this.benefitRepository.create({
      FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      TIPO: dto.TIPO,
      DESCRICAO: dto.DESCRICAO ?? null,
      VALOR: valor,
      METADADOS: (dto.METADADOS as BenefitMetadata) ?? null,
      DATA_INICIO: new Date(dto.DATA_INICIO),
      DATA_FIM: dto.DATA_FIM ? new Date(dto.DATA_FIM) : null,
      OBSERVACAO: dto.OBSERVACAO ?? null,
      CRIADO_POR: createdBy,
    });

    const saved = await this.benefitRepository.save(benefit);
    this.logger.log(`Benefício ${saved.ID} criado por ${createdBy}`);
    return saved;
  }

  async findAll(user: AuthUser): Promise<Benefit[]> {
    const query = this.benefitRepository
      .createQueryBuilder('benefit')
      .leftJoinAndSelect('benefit.FUNCIONARIO', 'FUNCIONARIO');

    if (
      user.role === UserRole.EMPLOYEE &&
      !user.permissions.includes(UserPermission.MANAGE_BENEFITS) &&
      !user.permissions.includes(UserPermission.VIEW_ALL_EMPLOYEES)
    ) {
      query.andWhere('benefit.FUNCIONARIO_ID = :id', {
        id: user.funcionario_id,
      });
    }

    return query.getMany();
  }

  async findByEmployee(funcionarioId: string): Promise<Benefit[]> {
    return this.benefitRepository.find({
      where: {
        FUNCIONARIO: {
          ID: funcionarioId,
        },
      },
      relations: ['FUNCIONARIO'],
    });
  }

  async findOne(id: string): Promise<Benefit> {
    const benefit = await this.benefitRepository.findOne({
      where: { ID: id },
      relations: ['FUNCIONARIO'],
    });

    if (!benefit) {
      this.logger.warn(`Benefício ${id} não encontrado`);
      throw new NotFoundException(`Benefício com ID ${id} não encontrado`);
    }

    return benefit;
  }

  async update(
    id: string,
    dto: UpdateBenefitDto,
    updatedBy: string,
  ): Promise<Benefit> {
    const benefit = await this.findOne(id);

    const efetiveType = dto.TIPO ?? benefit.TIPO;

    let efetiveValue = dto.VALOR ?? benefit.VALOR;
    if (dto.METADADOS !== undefined) {
      efetiveValue = this.calculateValue(
        efetiveType,
        dto.METADADOS ?? benefit.METADADOS,
        dto.VALOR,
      );
    }

    Object.assign(benefit, {
      ...(dto.FUNCIONARIO_ID !== undefined && {
        FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      }),

      ...(dto.TIPO !== undefined && { TIPO: dto.TIPO }),
      ...(dto.DESCRICAO !== undefined && { DESCRICAO: dto.DESCRICAO }),
      VALOR: efetiveValue,
      ...(dto.METADADOS !== undefined && { METADADOS: dto.METADADOS ?? null }),
      ...(dto.DATA_INICIO !== undefined && {
        DATA_INICIO: new Date(dto.DATA_INICIO),
      }),
      ...(dto.DATA_FIM !== undefined && { DATA_FIM: new Date(dto.DATA_FIM) }),
      ...(dto.STATUS_BENEFICIO !== undefined && {
        STATUS_BENEFICIO: dto.STATUS_BENEFICIO,
      }),
      ...(dto.OBSERVACAO !== undefined && { OBSERVACAO: dto.OBSERVACAO }),
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.benefitRepository.save(benefit);
    this.logger.log(`Benefício ${id} atualizado por ${updatedBy}`);
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const benefit = await this.findOne(id);
    await this.benefitRepository.remove(benefit);
    this.logger.log(`Benefício ${id} removido por ${deletedBy}`);
  }
}
