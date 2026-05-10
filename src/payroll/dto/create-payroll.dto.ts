import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreatePayrollDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  FUNCIONARIO_ID: string;

  @ApiProperty({ example: 3 })
  @IsInt({ message: 'O mês de referência deve ser um número inteiro' })
  @Min(1, { message: 'O mês de referência deve ser entre 1 e 12' })
  @Max(12, { message: 'O mês de referência deve ser entre 1 e 12' })
  @IsNotEmpty({ message: 'O mês de referência é obrigatório' })
  MES_REFERENCIA: number;

  @ApiProperty({ example: 2025 })
  @IsInt({ message: 'O ano de referência deve ser um número inteiro' })
  @Min(2000, { message: 'O ano de referência deve ser maior que 2000' })
  @Max(2100, { message: 'O ano de referência deve ser menor que 2100' })
  @IsNotEmpty({ message: 'O ano de referência é obrigatório' })
  ANO_REFERENCIA: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'O número de dependentes deve ser um número inteiro' })
  @Min(0, { message: 'O número de dependentes não pode ser negativo' })
  @IsOptional()
  NUMERO_DEPENDENTES?: number;

  @ApiProperty({ example: 5000.0 })
  @IsNumber({}, { message: 'O salário base deve ser um número' })
  @IsPositive({ message: 'O salário base deve ser positivo' })
  @IsNotEmpty({ message: 'O salário base é obrigatório' })
  SALARIO_BASE: number;

  @ApiPropertyOptional({ example: 500.0 })
  @IsNumber({}, { message: 'O bônus deve ser um número' })
  @Min(0, { message: 'O bônus não pode ser negativo' })
  @IsOptional()
  BONUS?: number;

  @ApiPropertyOptional({ example: 550.0 })
  @IsNumber({}, { message: 'O desconto INSS deve ser um número' })
  @Min(0, { message: 'O desconto INSS não pode ser negativo' })
  @IsOptional()
  DESCONTO_INSS?: number;

  @ApiPropertyOptional({ example: 300.0 })
  @IsNumber({}, { message: 'O desconto IRRF deve ser um número' })
  @Min(0, { message: 'O desconto IRRF não pode ser negativo' })
  @IsOptional()
  DESCONTO_IRRF?: number;

  @ApiPropertyOptional({ example: 100.0 })
  @IsNumber({}, { message: 'Outros descontos deve ser um número' })
  @Min(0, { message: 'Outros descontos não pode ser negativo' })
  @IsOptional()
  OUTROS_DESCONTOS?: number;

  @ApiPropertyOptional({ example: 220.0 })
  @IsNumber({}, { message: 'O valor da passagem deve ser um número' })
  @Min(0, { message: 'O valor da passagem não pode ser negativa' })
  @IsOptional()
  VALOR_PASSAGEM?: number;

  @ApiPropertyOptional({ example: 'Folha do mês de março' })
  @IsString({ message: 'A observação deve ser texto' })
  @IsOptional()
  OBSERVACAO?: string;
}
