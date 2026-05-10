import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { Repository } from 'typeorm';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Employee } from 'src/employees/entities/employee.entity';
import { PayrollStatusEnum } from './enums/payroll-status.enum';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

const INSS_FAIXAS = [
  { ate: 1518.0, aliquota: 0.075 },
  { ate: 2793.88, aliquota: 0.09 },
  { ate: 4190.83, aliquota: 0.12 },
  { ate: 8157.41, aliquota: 0.14 },
] as const;

const IRRF_DEDUCAO_DEPENDENTE = 189.59;
const IRRF_ISENCAO = 2259.2;

const IRRF_FAIXAS = [
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.0 },
] as const;

const VT_PERCENTUAL_TETO = 0.06;

@Injectable()
export class PayrollService {
  private readonly logger = new Logger(PayrollService.name);

  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  private calcINSS(base: number): number {
    let inss = 0;
    let anterior = 0;

    for (const faixa of INSS_FAIXAS) {
      if (base > faixa.ate) {
        inss += (faixa.ate - anterior) * faixa.aliquota;
        anterior = faixa.ate;
      } else {
        inss += (base - anterior) * faixa.aliquota;
        break;
      }
    }

    return Math.round(inss * 100) / 100;
  }

  private calcIRRF(base: number, inss: number, dependentes: number): number {
    const deducaoDependente = IRRF_DEDUCAO_DEPENDENTE * dependentes;
    const baseCalculo = base - inss - deducaoDependente;

    if (baseCalculo <= IRRF_ISENCAO) return 0;

    const faixa = IRRF_FAIXAS.find((f) => baseCalculo <= f.ate)!;
    return (
      Math.round((baseCalculo * faixa.aliquota - faixa.deducao) * 100) / 100
    );
  }

  private calcVT(salario: number, valorPassagem: number): number {
    const teto = Math.round(salario * VT_PERCENTUAL_TETO * 100) / 100;
    return Math.round(Math.min(valorPassagem, teto) * 100) / 100;
  }

  private calcLiquido(
    base: number,
    bonus: number,
    inss: number,
    irrf: number,
    outros: number,
    vt: number,
  ): number {
    return (
      Number(base) +
      Number(bonus) -
      Number(inss) -
      Number(irrf) -
      Number(outros) -
      Number(vt)
    );
  }

  async create(dto: CreatePayrollDto, createBy: string): Promise<Payroll> {
    const employee = await this.employeeRepository.findOne({
      where: { ID: dto.FUNCIONARIO_ID },
    });

    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${dto.FUNCIONARIO_ID} não encontrado`,
      );
    }

    const existing = await this.payrollRepository.findOne({
      where: {
        FUNCIONARIO: { ID: dto.FUNCIONARIO_ID },
        MES_REFERENCIA: dto.MES_REFERENCIA,
        ANO_REFERENCIA: dto.ANO_REFERENCIA,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe folha de pagamento para este funcionário em ${dto.MES_REFERENCIA}/${dto.ANO_REFERENCIA}`,
      );
    }

    const dependentes = dto.NUMERO_DEPENDENTES ?? 0;
    const bonus = dto.BONUS ?? 0;
    const inss = dto.DESCONTO_INSS ?? this.calcINSS(dto.SALARIO_BASE);
    const irrf =
      dto.DESCONTO_IRRF ?? this.calcIRRF(dto.SALARIO_BASE, inss, dependentes);
    const outros = dto.OUTROS_DESCONTOS ?? 0;
    const vt = this.calcVT(dto.SALARIO_BASE, dto.VALOR_PASSAGEM ?? 0);

    const payroll = this.payrollRepository.create({
      FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      MES_REFERENCIA: dto.MES_REFERENCIA,
      ANO_REFERENCIA: dto.ANO_REFERENCIA,
      NUMERO_DEPENDENTES: dependentes,
      SALARIO_BASE: dto.SALARIO_BASE,
      BONUS: dto.BONUS,
      DESCONTO_INSS: inss,
      DESCONTO_IRRF: irrf,
      OUTROS_DESCONTOS: outros,
      DESCONTO_VT: vt,
      VALOR_PASSAGEM: dto.VALOR_PASSAGEM ?? 0,
      SALARIO_LIQUIDO: this.calcLiquido(
        dto.SALARIO_BASE,
        bonus,
        inss,
        irrf,
        outros,
        vt,
      ),
      STATUS_FOLHA: PayrollStatusEnum.PENDENTE,
      OBSERVACAO: dto.OBSERVACAO ?? null,
      CRIADO_POR: createBy,
    });

    const saved = await this.payrollRepository.save(payroll);
    this.logger.log(`Folha de pagamento ${saved.ID} criada por ${createBy}`);
    return saved;
  }

  async findAll(): Promise<Payroll[]> {
    return this.payrollRepository.find({
      relations: ['FUNCIONARIO'],
      order: { ANO_REFERENCIA: 'DESC', MES_REFERENCIA: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { ID: id },
      relations: ['FUNCIONARIO'],
    });

    if (!payroll) {
      this.logger.warn(`Folha de pagamento ${id} não encontrada`);
      throw new NotFoundException(
        `Folha de pagamento com ID ${id} não encontrado`,
      );
    }

    return payroll;
  }

  async update(
    id: string,
    dto: UpdatePayrollDto,
    updatedBy: string,
  ): Promise<Payroll> {
    const payroll = await this.findOne(id);

    const funcionarioId = dto.FUNCIONARIO_ID ?? payroll.FUNCIONARIO.ID;
    const mes = dto.MES_REFERENCIA ?? payroll.MES_REFERENCIA;
    const ano = dto.ANO_REFERENCIA ?? payroll.ANO_REFERENCIA;

    if (
      dto.FUNCIONARIO_ID ||
      dto.MES_REFERENCIA !== undefined ||
      dto.ANO_REFERENCIA !== undefined
    ) {
      const conflict = await this.payrollRepository.findOne({
        where: {
          FUNCIONARIO: { ID: funcionarioId },
          MES_REFERENCIA: mes,
          ANO_REFERENCIA: ano,
        },
      });

      if (conflict && conflict.ID !== id) {
        throw new ConflictException(
          `Já existe uma folha de pagamento para este funcionário em ${mes}/${ano}`,
        );
      }
    }

    const base = dto.SALARIO_BASE ?? Number(payroll.SALARIO_BASE);
    const bonus = dto.BONUS ?? Number(payroll.BONUS);
    const dependentes =
      dto.NUMERO_DEPENDENTES ?? Number(payroll.NUMERO_DEPENDENTES);
    const inss = dto.DESCONTO_INSS ?? this.calcINSS(base);
    const irrf = dto.DESCONTO_IRRF ?? this.calcIRRF(base, inss, dependentes);
    const outros = dto.OUTROS_DESCONTOS ?? Number(payroll.OUTROS_DESCONTOS);
    const vt = this.calcVT(
      base,
      dto.VALOR_PASSAGEM ?? Number(payroll.VALOR_PASSAGEM),
    );

    Object.assign(payroll, {
      ...(dto.FUNCIONARIO_ID && {
        FUNCIONARIO: { ID: dto.FUNCIONARIO_ID } as Employee,
      }),
      ...(dto.MES_REFERENCIA !== undefined && {
        MES_REFERENCIA: dto.MES_REFERENCIA,
      }),
      ...(dto.ANO_REFERENCIA !== undefined && {
        ANO_REFERENCIA: dto.ANO_REFERENCIA,
      }),
      NUMERO_DEPENDENTES: dependentes,
      SALARIO_BASE: base,
      BONUS: bonus,
      DESCONTO_INSS: inss,
      DESCONTO_IRRF: irrf,
      OUTROS_DESCONTOS: outros,
      VALOR_PASSAGEM: dto.VALOR_PASSAGEM ?? Number(payroll.VALOR_PASSAGEM),
      DESCONTO_VT: vt,
      SALARIO_LIQUIDO: this.calcLiquido(base, bonus, inss, irrf, outros, vt),
      ...(dto.STATUS_FOLHA !== undefined && { STATUS_FOLHA: dto.STATUS_FOLHA }),
      ...(dto.OBSERVACAO !== undefined && { OBSERVACAO: dto.OBSERVACAO }),
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.payrollRepository.save(payroll);
    this.logger.log(`Folha de pagamento ${id} atualizada por ${updatedBy}`);
    return saved;
  }

  async pay(id: string, updatedBy: string): Promise<Payroll> {
    const payroll = await this.findOne(id);

    if (payroll.STATUS_FOLHA === PayrollStatusEnum.PAGO) {
      throw new BadRequestException('Esta folha de pagamento já foi paga.');
    }

    Object.assign(payroll, {
      STATUS_FOLHA: PayrollStatusEnum.PAGO,
      ATUALIZADO_POR: updatedBy,
    });

    const saved = await this.payrollRepository.save(payroll);
    this.logger.log(
      `Folha de pagamento ${id} marcada como PAGO por ${updatedBy}`,
    );
    return saved;
  }

  async remove(id: string, deletedBy: string): Promise<void> {
    const payroll = await this.findOne(id);
    await this.payrollRepository.remove(payroll);
    this.logger.log(`Folha de pagamento ${id} removida por ${deletedBy}`);
  }
}
