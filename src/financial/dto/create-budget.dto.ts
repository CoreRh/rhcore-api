import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BudgetCategoryEnum } from '../enums/budget-category.enum';

export class CreateBudgetDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do departamento deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do departamento é obrigatório' })
  DEPARTAMENTO_ID: string;

  @ApiProperty({ example: 2026 })
  @IsInt({ message: 'O ano de referência deve ser um número inteiro' })
  @Min(2000, { message: 'O ano de referência deve ser maior que 2000' })
  @Max(2100, { message: 'O ano de referência deve ser menor que 2100' })
  @IsNotEmpty({ message: 'O ano de referência é obrigatório' })
  ANO_REFERENCIA: number;

  @ApiProperty({ example: 6 })
  @IsInt({ message: 'O mês de referência deve ser um número inteiro' })
  @Min(1, { message: 'O mês de referência deve ser entre 1 e 12' })
  @Max(12, { message: 'O mês de referência deve ser entre 1 e 12' })
  @IsNotEmpty({ message: 'O mês de referência é obrigatório' })
  MES_REFERENCIA: number;

  @ApiProperty({
    enum: BudgetCategoryEnum,
    example: BudgetCategoryEnum.OPERACIONAL,
  })
  @IsEnum(BudgetCategoryEnum, { message: 'Categoria inválida' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  CATEGORIA: BudgetCategoryEnum;

  @ApiProperty({ example: 50000.0 })
  @IsNumber({}, { message: 'O valor orçado deve ser um número' })
  @IsPositive({ message: 'O valor orçado deve ser positivo' })
  @IsNotEmpty({ message: 'O valor orçado é obrigatório' })
  VALOR_ORCADO: number;

  @ApiPropertyOptional({ example: 'Orçamento de TI para o semestre' })
  @IsString({ message: 'A observação deve ser texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;
}
