import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategoryEnum } from '../enums/expense-category.enum';
import { ExpenseStatusEnum } from '../enums/expense-status.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class ExpenseEmployeeDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'João da Silva' })
  NOME: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;
}

export class ExpenseApproverDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'maria.gestora' })
  NOME_USUARIO: string;

  @ApiProperty({ example: 'maria@empresa.com.br' })
  EMAIL: string;
}

export class ExpenseDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => ExpenseEmployeeDto })
  FUNCIONARIO: ExpenseEmployeeDto;

  @ApiProperty({ enum: ExpenseCategoryEnum })
  CATEGORIA: ExpenseCategoryEnum;

  @ApiProperty({ example: 'Corrida de aplicativo até o cliente' })
  DESCRICAO: string;

  @ApiProperty({ example: 89.9 })
  VALOR: number;

  @ApiProperty({ example: '2026-06-10' })
  DATA_DESPESA: Date;

  @ApiPropertyOptional({ example: '/uploads/comprovantes/abc123.pdf' })
  COMPROVANTE_URL: string | null;

  @ApiProperty({ enum: ExpenseStatusEnum, example: ExpenseStatusEnum.PENDENTE })
  STATUS_DESPESA: ExpenseStatusEnum;

  @ApiPropertyOptional({ type: () => ExpenseApproverDto })
  APROVADO_POR: ExpenseApproverDto | null;

  @ApiPropertyOptional({ example: '2026-06-12T10:00:00.000Z' })
  DATA_APROVACAO: Date | null;

  @ApiPropertyOptional({ example: 'Aprovado conforme política' })
  OBSERVACAO: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-06-12T10:00:00.000Z' })
  CRIADO_EM: Date;
}

export class ExpenseResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: ExpenseDataDto })
  data: ExpenseDataDto;
}

export class ExpenseListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [ExpenseDataDto] })
  data: ExpenseDataDto[];
}
