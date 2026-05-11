import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { DepartmentDataDto } from 'src/departments/dto/department-response.dto';
import { PositionDataDto } from 'src/positions/dto/position-response.dto';

export class EmployeeGestorDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Maria Souza' })
  NOME: string;

  @ApiProperty({ example: '2025002' })
  MATRICULA: string;
}

export class EmployeeDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;

  @ApiProperty({ example: 'JOAO DA SILVA' })
  NOME: string;

  @ApiProperty({ example: '123.456.789-00' })
  CPF: string;

  @ApiPropertyOptional({ example: '12.345.678-9' })
  RG: string | null;

  @ApiProperty({ example: '1990-05-20' })
  DATA_NASCIMENTO: Date;

  @ApiProperty({ example: 'joao.silva@empresa.com' })
  EMAIL: string;

  @ApiPropertyOptional({ example: '(31) 99999-9999' })
  TELEFONE: string | null;

  @ApiPropertyOptional({ example: '2025-01-15' })
  DATA_ADMISSAO: Date | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiPropertyOptional({ type: () => DepartmentDataDto })
  DEPARTAMENTO: DepartmentDataDto | null;

  @ApiPropertyOptional({ type: () => PositionDataDto })
  CARGO: PositionDataDto | null;

  @ApiPropertyOptional({ type: () => EmployeeGestorDto })
  GESTOR: EmployeeGestorDto | null;
}

export class EmployeeResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: EmployeeDataDto })
  data: EmployeeDataDto;
}

export class EmployeeListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [EmployeeDataDto] })
  data: EmployeeDataDto[];
}
