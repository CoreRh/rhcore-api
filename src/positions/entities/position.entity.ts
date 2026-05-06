import { Department } from 'src/departments/entities/department.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('CARGOS')
export class Position extends BaseEntity {
  @Column({
    name: 'NOME',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  NOME: string;

  @Column({
    name: 'DESCRICAO',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  DESCRICAO: string | null;

  @Column({
    name: 'NIVEL',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  NIVEL: string | null;

  @Column({
    name: 'SALARIO_BASE',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  SALARIO_BASE: number | null;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DEPARTAMENTO_ID' })
  DEPARTAMENTO: Department | null;
}
