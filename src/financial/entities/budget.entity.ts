import { Department } from 'src/departments/entities/department.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BudgetCategoryEnum } from '../enums/budget-category.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { decimalTransformer } from 'src/common/transformers/decimal.transformer';

@Entity('ORCAMENTOS')
@Unique(['DEPARTAMENTO', 'ANO_REFERENCIA', 'MES_REFERENCIA', 'CATEGORIA'])
@Index(['ANO_REFERENCIA', 'MES_REFERENCIA'])
export class Budget extends BaseEntity {
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'DEPARTAMENTO_ID' })
  DEPARTAMENTO: Department;

  @Column({ name: 'ANO_REFERENCIA', type: 'int' })
  ANO_REFERENCIA: number;

  @Column({ name: 'MES_REFERENCIA', type: 'int' })
  MES_REFERENCIA: number;

  @Column({
    name: 'CATEGORIA',
    type: 'varchar',
    enum: BudgetCategoryEnum,
  })
  CATEGORIA: BudgetCategoryEnum;

  @Column({
    name: 'VALOR_ORCADO',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  VALOR_ORCADO: number;

  @Column({ name: 'OBSERVACAO', type: 'varchar', length: 500, nullable: true })
  OBSERVACAO: string | null;
}
