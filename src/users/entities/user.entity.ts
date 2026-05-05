import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Employee } from 'src/employees/entities/employee.entity';
import { UserPermission } from 'src/common/enums/user-permission.enum';

@Entity('USUARIOS')
export class User extends BaseEntity {
  @Column({
    name: 'NOME_USUARIO',
    length: 255,
  })
  NOME_USUARIO: string;

  @Column({
    name: 'EMAIL',
    length: 255,
    unique: true,
  })
  EMAIL: string;

  @Column({
    name: 'SENHA',
    length: 255,
  })
  SENHA: string;

  @Column({
    name: 'REFRESH_TOKEN',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  REFRESH_TOKEN: string | null;

  @Column({
    name: 'ROLE',
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  ROLE: UserRole;

  @Column({
    name: 'RESET_PASSWORD_TOKEN',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  RESET_PASSWORD_TOKEN: string | null;

  @Column({
    name: 'RESET_PASSWORD_EXPIRES',
    nullable: true,
    type: 'timestamp',
  })
  RESET_PASSWORD_EXPIRES: Date | null;

  @OneToOne(() => Employee, { nullable: true, eager: false })
  @JoinColumn({ name: 'FUNCIONARIO_ID' })
  FUNCIONARIO: Employee | null;

  @Column({
    name: 'FUNCIONARIO_ID',
    type: 'uuid',
    nullable: true,
    unique: true,
  })
  FUNCIONARIO_ID: string | null;

  @Column({
    name: 'PERMISSIONS',
    type: 'json',
    default: () => "'[]'",
  })
  PERMISSIONS: UserPermission[];
}
