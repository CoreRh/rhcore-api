import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';
import { UserPermission } from 'src/common/enums/user-permission.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UserDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'joao.silva' })
  NOME_USUARIO: string;

  @ApiProperty({ example: 'joao@email.com' })
  EMAIL: string;

  @ApiProperty({ example: 'ATIVO', enum: BaseEntityStatusEnum })
  STATUS: BaseEntityStatusEnum;

  @ApiPropertyOptional({ example: 'admin', nullable: true })
  ATUALIZADO_POR: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiProperty({ example: 'EMPLOYEE', enum: UserRole })
  ROLE: UserRole;

  @ApiPropertyOptional({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    nullable: true,
  })
  FUNCIONARIO_ID: string | null;

  @ApiProperty({
    example: ['APPROVE_VACATIONS'],
    enum: UserPermission,
    isArray: true,
  })
  PERMISSIONS: UserPermission[];
}

export class UserResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: UserDataDto })
  data: UserDataDto;
}

export class UserListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [UserDataDto] })
  data: UserDataDto[];
}
