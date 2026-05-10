import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';
import { DepartmentDataDto } from 'src/departments/dto/department-response.dto';

export class PositionDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Desenvolvedor Junior' })
  NOME: string;

  @ApiPropertyOptional({
    example: 'Responsável pelo desenvolvimento de sistemas',
  })
  DESCRICAO: string | null;

  @ApiPropertyOptional({ example: 'Junior' })
  NIVEL: string | null;

  @ApiPropertyOptional({ example: 8500.0 })
  SALARIO_BASE: number | null;

  @ApiProperty({
    enum: BaseEntityStatusEnum,
    example: BaseEntityStatusEnum.ATIVO,
  })
  STATUS: BaseEntityStatusEnum;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiPropertyOptional({ example: 'admin' })
  ATUALIZADO_POR: string | null;

  @ApiPropertyOptional({ example: '2026-01-02T00:00:00.000Z' })
  ATUALIZADO_EM: Date | null;

  @ApiPropertyOptional({ type: () => DepartmentDataDto })
  DEPARTAMENTO: DepartmentDataDto | null;
}

export class PositionResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: PositionDataDto })
  data: PositionDataDto;
}

export class PositionListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [PositionDataDto] })
  data: PositionDataDto[];
}
