import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';

export class DepartmentDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Tecnologia da Informação' })
  NOME: string;

  @ApiProperty({ example: 'TI' })
  SIGLA: string;

  @ApiPropertyOptional({ example: 'Departamento responsável pela TI' })
  DESCRICAO: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  ATUALIZADO_EM: Date | null;

  @ApiProperty({ example: 'admin' })
  ATUALIZADO_POR: string | null;

  @ApiProperty({
    enum: BaseEntityStatusEnum,
    example: BaseEntityStatusEnum.ATIVO,
  })
  STATUS: BaseEntityStatusEnum;

  @ApiPropertyOptional({ type: () => DepartmentDataDto })
  DEPARTAMENTO_PAI: DepartmentDataDto | null;
}

export class DepartmentResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: DepartmentDataDto })
  data: DepartmentDataDto;
}

export class DepartmentListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [DepartmentDataDto] })
  data: DepartmentDataDto[];
}
