import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSalaryAdvanceDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  VALOR: number;

  @ApiProperty({ example: '2026-06-10' })
  @IsDateString(
    {},
    { message: 'A data de solicitação deve ser uma data válida' },
  )
  @IsNotEmpty({ message: 'A data de solicitação é obrigatória' })
  DATA_SOLICITAÇÃO: string;

  @ApiProperty({ example: 3 })
  @IsInt({ message: 'O número de parcelas deve ser um número inteiro' })
  @Min(1, { message: 'O número de parcelas deve ser entre 1 e 12' })
  @Max(12, { message: 'O número de parcelas deve ser entre 1 e 12' })
  @IsNotEmpty({ message: 'O número de parcelas é obrigatório' })
  NUMERO_PARCELAS: number;

  @ApiProperty({ example: 'Adiantamento para emergência médica' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ser no máximo 500 caracteres' })
  OBSERVACAO?: string;
}
