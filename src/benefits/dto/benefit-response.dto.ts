import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BeneficioTipoEnum } from '../enums/beneficio-tipo.enum';
import { BeneficioStatusEnum } from '../enums/beneficio-status.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import type { BenefitMetadata } from '../types/benefit-metadata.types';

export class BenefitEmployeeDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'João da Silva' })
  NOME: string;

  @ApiProperty({ example: '2025001' })
  MATRICULA: string;
}

export class BenefitDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => BenefitEmployeeDto })
  FUNCIONARIO: BenefitEmployeeDto;

  @ApiProperty({
    enum: BeneficioTipoEnum,
    example: BeneficioTipoEnum.VALE_REFEICAO,
  })
  TIPO: BeneficioTipoEnum;

  @ApiPropertyOptional({ example: 'Benefício de vale-refeição mensal' })
  DESCRICAO: string | null;

  @ApiProperty({ example: 500.0 })
  VALOR: number;

  @ApiPropertyOptional({
    oneOf: [
      { $ref: '#/components/schemas/ValeTransporteMetadadosDto' },
      { $ref: '#/components/schemas/ValeRefeicaoMetadadosDto' },
      { $ref: '#/components/schemas/PlanoSaudeMetadadosDto' },
    ],
    nullable: true,
  })
  METADADOS: BenefitMetadata;

  @ApiProperty({ example: '2025-12-31' })
  DATA_INICIO: Date;

  @ApiPropertyOptional({ example: '2025-12-31' })
  DATA_FIM: Date | null;

  @ApiProperty({
    enum: BeneficioStatusEnum,
    example: BeneficioStatusEnum.ATIVO,
  })
  STATUS_BENEFICIO: BeneficioStatusEnum;

  @ApiPropertyOptional({ example: 'Benefício concedido por política interna' })
  OBSERVACAO: string | null;

  @ApiProperty({ example: 'admin' })
  CRIADO_POR: string;

  @ApiProperty({ example: '2026-0101T00:00:00.000Z' })
  CRIADO_EM: Date;
}

export class BenefitResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [BenefitDataDto] })
  data: BenefitDataDto;
}

export class BenefitListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [BenefitDataDto] })
  data: BenefitDataDto[];
}
