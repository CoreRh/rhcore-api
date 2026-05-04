import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum PlanoTipoEnum {
  INDIVIDUAL = 'INDIVIDUAL',
  FAMILIAR = 'FAMILIAR',
  EMPRESARIAL = 'EMPRESARIAL',
}

export enum CoberturaPlanoEnum {
  BASICO = 'BASICO',
  INTERMEDIARIO = 'INTERMEDIARIO',
  PREMIUM = 'PREMIUM',
}

export class ValeTransporteMetadadosDto {
  @ApiProperty({ example: 5.5 })
  @IsNumber({}, { message: 'Valor da passagem é obrigatório' })
  @IsPositive({ message: 'Valor da passagem deve ser positivo' })
  VALOR_PASSAGEM: number;

  @ApiProperty({ example: 2 })
  @IsInt({ message: 'Quantidade diária é obrigatória' })
  @Min(1, { message: 'A quantidade diária deve ser pelo menos 1' })
  QUANTIDADE_DIARIA: number;

  @ApiProperty({ example: 22 })
  @IsInt({ message: 'Dias úteis deve ser entre 1 e 31' })
  @Min(1, { message: 'Dias úteis deve ser entre 1 e 31' })
  @Max(31, { message: 'Dias úteis deve ser entre 1 e 31' })
  DIAS_UTEIS: number;
}

export class ValeRefeicaoMetadadosDto {
  @ApiProperty({ example: 30.0 })
  @IsNumber({}, { message: 'Valor diário é obrigatório' })
  @IsPositive({ message: 'Valor diário deve ser positivo' })
  VALOR_DIARIO: number;

  @ApiProperty({ example: 22 })
  @IsInt({ message: 'Dias úteis deve ser entre 1 e 31' })
  @Min(1, { message: 'Dias úteis deve ser entre 1 e 31' })
  @Max(31, { message: 'Dias úteis deve ser entre 1 e 31' })
  DIAS_UTEIS: number;
}

export class PlanoSaudeMetadadosDto {
  @ApiProperty({ example: 'Unimed' })
  @IsString({ message: 'Operadora é obrigatória' })
  @IsNotEmpty({ message: 'Operadora é obrigatória' })
  OPERADORA: string;

  @ApiProperty({ enum: PlanoTipoEnum })
  @IsEnum(PlanoTipoEnum, { message: 'Tipo de plano inválido' })
  TIPO_PLANO: PlanoTipoEnum;

  @ApiProperty({ example: 30 })
  @IsNumber({}, { message: 'Percentual deve ser entre 0 e 100' })
  @Min(0, { message: 'Percentual deve ser entre 0 e 100' })
  @Max(100, { message: 'Percentual deve ser entre 0 e 100' })
  PERCENTUAL_FUNCIONARIO: number;
}
