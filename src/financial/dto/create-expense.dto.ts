import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ExpenseCategoryEnum } from '../enums/expense-category.enum';

export class CreateExpenseDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  FUNCIONARIO_ID: string;

  @ApiProperty({
    enum: ExpenseCategoryEnum,
    example: ExpenseCategoryEnum.TRANSPORTE,
  })
  @IsEnum(ExpenseCategoryEnum, { message: 'Categoria inválida' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  CATEGORIA: ExpenseCategoryEnum;

  @ApiProperty({ example: 'Corrida de aplicativo até o cliente' })
  @IsString({ message: 'A descrição deve ser texto' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  DESCRICAO: string;

  @ApiProperty({ example: 89.9 })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  VALOR: number;

  @ApiProperty({ example: '2026-06-10' })
  @IsDateString({}, { message: 'A data da despesa deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data da despesa é obrigatória' })
  DATA_DESPESA: string;

  @ApiPropertyOptional({ example: 'Almoço com cliente durante visita' })
  @IsString({ message: 'A observação deve ser texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;
}
