import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { RequestTypeEnum } from '../enums/request-type.enum';
import { RequestStatusEnum } from '../enums/request-status.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('SOLICITACOES')
export class Request extends BaseEntity {
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee;

  @Column({
    name: 'SITUACAO',
    type: 'varchar',
    enum: RequestStatusEnum,
    default: RequestStatusEnum.PENDENTE,
  })
  SITUACAO: RequestStatusEnum;

  @Column({
    name: 'TIPO',
    type: 'varchar',
    enum: RequestTypeEnum,
  })
  TIPO: RequestTypeEnum;

  @Column({
    name: 'DESCRICAO',
    type: 'varchar',
    length: 500,
  })
  DESCRICAO: string;

  @Column({
    name: 'OBSERVACAO',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  OBSERVACAO: string | null;

  @Column({
    name: 'DATA_SOLICITACAO',
    type: 'date',
  })
  DATA_SOLICITACAO: Date;

  @Column({
    name: 'DATA_RESPOSTA',
    type: 'date',
    nullable: true,
  })
  DATA_RESPOSTA: Date | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'APROVADO_POR_ID' })
  APROVADO_POR: User | null;
}
