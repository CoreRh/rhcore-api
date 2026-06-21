import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExpenseCategoryEnum } from '../enums/expense-category.enum';
import { ExpenseStatusEnum } from '../enums/expense-status.enum';
import { User } from 'src/users/entities/user.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('DESPESAS')
export class Expense extends BaseEntity {
  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee;

  @Column({
    name: 'CATEGORIA',
    type: 'varchar',
    enum: ExpenseCategoryEnum,
  })
  CATEGORIA: ExpenseCategoryEnum;

  @Column({ name: 'DESCRICAO', type: 'varchar', length: 255 })
  DESCRICAO: string;

  @Column({
    name: 'VALOR',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  VALOR: number;

  @Column({ name: 'DATA_DESPESA', type: 'date' })
  DATA_DESPESA: Date;

  @Column({
    name: 'COMPROVANTE_URL',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  COMPROVANTE_URL: string | null;

  @Column({
    name: 'STATUS_DESPESA',
    type: 'varchar',
    enum: ExpenseStatusEnum,
    default: ExpenseStatusEnum.PENDENTE,
  })
  STATUS_DESPESA: ExpenseStatusEnum;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'APROVADO_POR_ID' })
  APROVADO_POR: User | null;

  @Column({ name: 'DATA_APROVACAO', type: 'timestamp', nullable: true })
  DATA_APROVACAO: Date | null;

  @Column({ name: 'OBSERVACAO', type: 'varchar', length: 500, nullable: true })
  OBSERVACAO: string | null;
}
