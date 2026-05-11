import { Department } from 'src/departments/entities/department.entity';
import { Position } from 'src/positions/entities/position.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('FUNCIONARIOS')
export class Employee extends BaseEntity {
  @Column({
    name: 'MATRICULA',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  MATRICULA: string;

  @Column({
    name: 'NOME',
    type: 'varchar',
    length: 100,
  })
  NOME: string;

  @Column({
    name: 'CPF',
    type: 'varchar',
    length: 14,
    unique: true,
  })
  CPF: string;

  @Column({
    name: 'RG',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  RG: string | null;

  @Column({
    name: 'DATA_NASCIMENTO',
    type: 'date',
  })
  DATA_NASCIMENTO: Date;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  EMAIL: string;

  @Column({
    name: 'TELEFONE',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  TELEFONE: string | null;

  @Column({
    name: 'DATA_ADMISSAO',
    type: 'date',
    nullable: true,
  })
  DATA_ADMISSAO: Date | null;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DEPARTAMENTO_ID' })
  DEPARTAMENTO: Department;

  @ManyToOne(() => Position, { nullable: true })
  @JoinColumn({ name: 'CARGO_ID' })
  CARGO: Position;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'GESTOR_ID' })
  GESTOR: Employee;
}
