import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntityStatusEnum } from '../enums/base-entity-status.enum';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column({
    name: 'CRIADO_POR',
    type: 'varchar',
    length: 20,
  })
  CRIADO_POR: string;

  @CreateDateColumn({
    name: 'CRIADO_EM',
    type: 'timestamp',
  })
  CRIADO_EM: Date;

  @Column({
    name: 'STATUS',
    type: 'varchar',
    enum: BaseEntityStatusEnum,
    default: BaseEntityStatusEnum.ATIVO,
  })
  STATUS: BaseEntityStatusEnum;

  @Column({
    name: 'ATUALIZADO_POR',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  ATUALIZADO_POR: string | null;

  @UpdateDateColumn({
    name: 'ATUALIZADO_EM',
    type: 'timestamp',
    nullable: true,
  })
  ATUALIZADO_EM: Date | null;

  @Column({
    name: 'EXCLUIDO_POR',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  EXCLUIDO_POR: string | null;

  @DeleteDateColumn({
    name: 'EXCLUIDO_EM',
    type: 'timestamp',
    nullable: true,
  })
  EXCLUIDO_EM: Date | null;
}
