import { ApiProperty } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { BudgetDepartmentDto } from './budget-response.dto';

export class BudgetSummaryItemDto {
  @ApiProperty({ type: () => BudgetDepartmentDto })
  DEPARTAMENTO: BudgetDepartmentDto;

  @ApiProperty({ example: 2026 })
  ANO_REFERENCIA: number;

  @ApiProperty({ example: 6 })
  MES_REFERENCIA: number;

  @ApiProperty({ example: 50000.0 })
  VALOR_ORCADO: number;

  @ApiProperty({
    example: 32500.0,
    description:
      'Soma de despesas APROVADO/PAGO + folha de pagamento do departamento no período',
  })
  VALOR_GASTO: number;

  @ApiProperty({ example: 17500.0 })
  SALDO: number;

  @ApiProperty({
    example: 65.0,
    description: 'Percentual já consumido do orçamento',
  })
  PERCENTUAL_CONSUMIDO: number;
}

export class BudgetSummaryResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [BudgetSummaryItemDto] })
  data: BudgetSummaryItemDto[];
}
