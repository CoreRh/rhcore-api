import { Employee } from 'src/employees/entities/employee.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BeneficioTipoEnum } from '../enums/beneficio-tipo.enum';
import { BeneficioStatusEnum } from '../enums/beneficio-status.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BenefitMetadata } from '../types/benefit-metadata.types';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('BENEFICIOS')
export class Benefit extends BaseEntity {
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee;

  @Column({
    name: 'TIPO',
    type: 'varchar',
    enum: BeneficioTipoEnum,
  })
  TIPO: BeneficioTipoEnum;

  @Column({
    name: 'DESCRICAO',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  DESCRICAO: string | null;

  @Column({
    name: 'VALOR',
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  VALOR: number;

  @Column({ name: 'METADADOS', type: 'jsonb', nullable: true })
  METADADOS: BenefitMetadata | null;

  @Column({
    name: 'DATA_INICIO',
    type: 'date',
  })
  DATA_INICIO: Date;

  @Column({
    name: 'DATA_FIM',
    type: 'date',
    nullable: true,
  })
  DATA_FIM: Date | null;

  @Column({
    name: 'STATUS_BENEFICIO',
    type: 'varchar',
    enum: BeneficioStatusEnum,
    default: BeneficioStatusEnum.ATIVO,
  })
  STATUS_BENEFICIO: BeneficioStatusEnum;

  @Column({
    name: 'OBSERVACAO',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  OBSERVACAO: string | null;
}
