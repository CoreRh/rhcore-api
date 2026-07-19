import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { SalaryAdvance } from './salary-advance.entity';
import { Payroll } from 'src/payroll/entities/payroll.entity';
import { InstallmentStatusEnum } from '../enums/installment-status.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { decimalTransformer } from 'src/common/transformers/decimal.transformer';

@Entity('PARCELAS_ADIANTAMENTO')
@Index(['ADIANTAMENTO_ID'])
@Index(['ANO_REFERENCIA', 'MES_REFERENCIA', 'STATUS_PARCELA'])
export class SalaryAdvanceInstallment extends BaseEntity {
  @ManyToOne(() => SalaryAdvance)
  @JoinColumn({ name: 'ADIANTAMENTO_ID' })
  ADIANTAMENTO: SalaryAdvance;

  @Column({ name: 'ADIANTAMENTO_ID', type: 'uuid' })
  ADIANTAMENTO_ID: string;

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

  @ManyToOne(() => Payroll, { nullable: true })
  @JoinColumn({ name: 'FOLHA_PAGAMENTO_ID' })
  FOLHA_PAGAMENTO: Payroll | null;

  @Column({ name: 'FOLHA_PAGAMENTO_ID', type: 'uuid', nullable: true })
  FOLHA_PAGAMENTO_ID: string | null;

  @Column({
    name: 'STATUS_PARCELA',
    type: 'varchar',
    enum: InstallmentStatusEnum,
    default: InstallmentStatusEnum.PENDENTE,
  })
  STATUS_PARCELA: InstallmentStatusEnum;
}
