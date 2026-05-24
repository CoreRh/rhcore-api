import { ApiProperty } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export type ActivityType = 'FUNCIONARIO' | 'FERIAS' | 'SOLICITACAO';

export class ActivityDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({
    enum: ['FUNCIONARIO', 'FERIAS', 'SOLICITACAO'],
    example: 'FUNCIONARIO',
  })
  TIPO: ActivityType;

  @ApiProperty({ example: 'João Silva' })
  TITULO: string;

  @ApiProperty({ example: 'Funcionário admitido' })
  DESCRICAO: string;

  @ApiProperty({ example: 'ATIVO', nullable: true })
  STATUS: string | null;

  @ApiProperty({ example: '2026-05-24T10:30:00.000Z' })
  CRIADO_EM: string;
}

export class ActivityListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [ActivityDataDto] })
  data: ActivityDataDto[];
}
