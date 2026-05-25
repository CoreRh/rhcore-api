import { ApiProperty } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';
import { RequestStatusEnum } from 'src/requests/enums/request-status.enum';
import { VacationStatusEnum } from 'src/vacations/enums/vacation-status.enum';
import { ActivityTypeEnum } from '../enums/activity.enum';

export class ActivityDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({
    enum: ['FUNCIONARIO', 'FERIAS', 'SOLICITACAO'],
    example: 'FUNCIONARIO',
  })
  TIPO: ActivityTypeEnum;

  @ApiProperty({ example: 'João Silva' })
  TITULO: string;

  @ApiProperty({ example: 'Funcionário admitido' })
  DESCRICAO: string;

  @ApiProperty({
    example: 'ATIVO',
    enum: [
      ...Object.values(BaseEntityStatusEnum),
      ...Object.values(VacationStatusEnum),
      ...Object.values(RequestStatusEnum),
    ],
  })
  STATUS: string;

  @ApiProperty({ example: '2026-05-24T10:30:00.000Z' })
  CRIADO_EM: string;
}

export class ActivityListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [ActivityDataDto] })
  data: ActivityDataDto[];
}
