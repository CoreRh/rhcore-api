import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { BeneficioTipoEnum } from '../enums/beneficio-tipo.enum';
import { IsValidMetadados } from '../validators/metadados.validator';
import {
  PlanoSaudeMetadadosDto,
  ValeRefeicaoMetadadosDto,
  ValeTransporteMetadadosDto,
} from './benefit-metadata.dto';

export class CreateBenefitDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  @IsUUID('4', { message: 'O ID do funcionário deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O ID do funcionário é obrigatório' })
  FUNCIONARIO_ID: string;

  @ApiProperty({
    enum: BeneficioTipoEnum,
    example: BeneficioTipoEnum.VALE_REFEICAO,
  })
  @IsEnum(BeneficioTipoEnum, { message: 'Tipo de benefício inválido' })
  @IsNotEmpty({ message: 'O tipo do benefício é obrigatório' })
  TIPO: BeneficioTipoEnum;

  @ApiPropertyOptional({ example: 500.0 })
  @ValidateIf(
    (o) =>
      o.TIPO === BeneficioTipoEnum.PLANO_SAUDE ||
      o.TIPO === BeneficioTipoEnum.OUTROS,
  )
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  VALOR?: number;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString({}, { message: 'A data de início deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  DATA_INICIO: string;

  @ApiPropertyOptional({
    oneOf: [
      { $ref: '#/components/schemas/ValeTransporteMetadadosDto' },
      { $ref: '#/components/schemas/ValeRefeicaoMetadadosDto' },
      { $ref: '#/components/schemas/PlanoSaudeMetadadosDto' },
    ],
  })
  @ValidateIf((o) => o.TIPO !== BeneficioTipoEnum.OUTROS)
  @IsObject({ message: 'Metadados devem ser um objeto válido' })
  @IsValidMetadados()
  METADADOS?:
    | ValeTransporteMetadadosDto
    | ValeRefeicaoMetadadosDto
    | PlanoSaudeMetadadosDto;

  @ApiPropertyOptional({ example: 'Benefício de vale-refeição mensal' })
  @IsString({ message: 'A descrição deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  DESCRICAO?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsDateString({}, { message: 'A data de fim deve ser uma data válida' })
  @IsOptional()
  DATA_FIM?: string;

  @ApiPropertyOptional({ example: 'Benefício concedido por política interna' })
  @IsString({ message: 'A observação deve ser do tipo texto' })
  @IsOptional()
  @MaxLength(500, { message: 'A observação deve ter no máximo 500 caracteres' })
  OBSERVACAO?: string;
}
