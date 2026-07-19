import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstallmentStatusEnum } from '../enums/installment-status.enum';
import { ExpenseApproverDto, ExpenseEmployeeDto } from './expense-response.dto';
import { SalaryAdvanceStatusEnum } from '../enums/salary-advance-status.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class SalaryAdvanceInstallmentDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 1 })
  NUMERO_PARCELA: number;

  @ApiProperty({ example: 333.33 })
  VALOR_PARCELA: number;

  @ApiProperty({ example: 7 })
  MES_REFERENCIA: number;

  @ApiProperty({ example: 2026 })
  ANO_REFERENCIA: number;

  @ApiProperty({ enum: InstallmentStatusEnum })
  STATUS_PARCELA: InstallmentStatusEnum;

  @ApiPropertyOptional({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  FOLHA_PAGAMENTO_ID: string | null;
}

export class SalaryAdvanceDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => ExpenseEmployeeDto })
  FUNCIONARIO: ExpenseEmployeeDto;

  @ApiProperty({ example: 1000.0 })
  VALOR: number;

  @ApiProperty({ example: '2026-06-10' })
  DATA_SOLICITACAO: Date;

  @ApiProperty({ example: 3 })
  NUMERO_PARCELAS: number;

  @ApiProperty({ enum: SalaryAdvanceStatusEnum })
  STATUS_ADIANTAMENTO: SalaryAdvanceStatusEnum;

  @ApiPropertyOptional({ type: () => ExpenseApproverDto })
  APROVADO_POR: ExpenseApproverDto | null;

  @ApiPropertyOptional({ example: '2026-06-12T10:00:00.000Z' })
  DATA_APROVACAO: Date | null;

  @ApiPropertyOptional({ example: 'Aprovado' })
  OBSERVACAO: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-06-12T10:00:00.000Z' })
  CRIADO_EM: Date;

  @ApiPropertyOptional({ type: () => [SalaryAdvanceInstallmentDataDto] })
  PARCELAS?: SalaryAdvanceInstallmentDataDto[];
}

export class SalaryAdvanceResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: SalaryAdvanceDataDto })
  data: SalaryAdvanceDataDto;
}

export class SalaryAdvanceListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [SalaryAdvanceDataDto] })
  data: SalaryAdvanceDataDto[];
}
