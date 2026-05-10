import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { PayrollStatusEnum } from '../enums/payroll-status.enum';

export class PayrollEmployeeDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'João da Silva' })
  NOME: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;
}

export class PayrollDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => PayrollEmployeeDto })
  FUNCIONARIO: PayrollEmployeeDto;

  @ApiProperty({ example: 3 })
  MES_REFERENCIA: number;

  @ApiProperty({ example: 2025 })
  ANO_REFERENCIA: number;

  @ApiProperty({ example: 1 })
  NUMERO_DEPENDENTES: number;

  @ApiProperty({ example: 5000.0 })
  SALARIO_BASE: number;

  @ApiProperty({ example: 500.0 })
  BONUS: number;

  @ApiProperty({ example: 550.0 })
  DESCONTO_INSS: number;

  @ApiProperty({ example: 300.0 })
  DESCONTO_IRRF: number;

  @ApiProperty({ example: 100.0 })
  OUTROS_DESCONTOS: number;

  @ApiProperty({ example: 220.0 })
  DESCONTO_VT: number;

  @ApiProperty({ example: 400.0 })
  VALOR_PASSAGEM: number;

  @ApiProperty({ example: 4550.0 })
  SALARIO_LIQUIDO: number;

  @ApiProperty({ enum: PayrollStatusEnum, example: PayrollStatusEnum.PENDENTE })
  STATUS_FOLHA: PayrollStatusEnum;

  @ApiPropertyOptional({ example: 'Folha do mês de março' })
  OBSERVACAO: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiProperty({ example: 'admin' })
  ATUALIZADO_POR: string | null;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  ATUALIZADO_EM: Date | null;
}

export class PayrollResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: PayrollDataDto })
  data: PayrollDataDto;
}

export class PayrollListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [PayrollDataDto] })
  data: PayrollDataDto[];
}
