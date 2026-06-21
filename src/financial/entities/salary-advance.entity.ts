import { Employee } from 'src/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SalaryAdvanceStatusEnum } from '../enums/salary-advance-status.enum';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('ADIANTAMENTOS')
export class SalaryAdvance extends BaseEntity {
  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee;

  @Column({
    name: 'VALOR',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  VALOR: number;

  @Column({ name: 'DATA_SOLICITACAO', type: 'date' })
  DATA_SOLICITACAO: Date;

  @Column({ name: 'NUMERO_PARCELAS', type: 'int' })
  NUMERO_PARCELAS: number;

  @Column({
    name: 'STATUS_ADIANTAMENTO',
    type: 'varchar',
    enum: SalaryAdvanceStatusEnum,
    default: SalaryAdvanceStatusEnum.PENDENTE,
  })
  STATUS_ADIANTAMENTO: SalaryAdvanceStatusEnum;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'APROVADO_POR_ID' })
  APROVADO_POR: User | null;

  @Column({ name: 'DATA_APROVACAO', type: 'timestamp', nullable: true })
  DATA_APROVACAO: Date | null;

  @Column({ name: 'OBSERVACAO', type: 'varchar', length: 500, nullable: true })
  OBSERVACAO: string | null;
}
