import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SalaryAdvance } from './salary-advance.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { InstallmentStatusEnum } from '../enums/installment-status.enum';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('PARCELAS_ADIANTAMENTO')
export class SalaryAdvanceInstallment extends BaseEntity {
  @ManyToOne(() => SalaryAdvance, { eager: true })
  @JoinColumn({ name: 'ADIANTAMENTO_ID' })
  ADIANTAMENTO: SalaryAdvance;

  @Column({ name: 'NUMERO_PARCELA', type: 'int' })
  NUMERO_PARCELA: number;

  @Column({
    name: 'VALOR_PARCELA',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  VALOR_PARCELA: number;

  @Column({ name: 'MES_REFERENCIA', type: 'int' })
  MES_REFERENCIA: number;

  @Column({ name: 'ANO_REFERENCIA', type: 'int' })
  ANO_REFERENCIA: number;

  @ManyToOne(() => Payroll, { nullable: true, eager: true })
  @JoinColumn({ name: 'FOLHA_PAGAMENTO_ID' })
  FOLHA_PAGAMENTO: Payroll | null;

  @Column({
    name: 'STATUS_PARCELA',
    type: 'varchar',
    enum: InstallmentStatusEnum,
    default: InstallmentStatusEnum.PENDENTE,
  })
  STATUS_PARCELA: InstallmentStatusEnum;
}
