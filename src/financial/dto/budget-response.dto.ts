import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BudgetCategoryEnum } from '../enums/budget-category.enum';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class BudgetDepartmentDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ example: 'Tecnologia da Informação' })
  NOME: string;

  @ApiProperty({ example: 'TI' })
  SIGLA: string;
}

export class BudgetDataDto {
  @ApiProperty({ example: 'a3bb189e-8bf9-3888-9912-ace4e6543002' })
  ID: string;

  @ApiProperty({ type: () => BudgetDepartmentDto })
  DEPARTAMENTO: BudgetDepartmentDto;

  @ApiProperty({ example: 2026 })
  ANO_REFERENCIA: number;

  @ApiProperty({ example: 6 })
  MES_REFERENCIA: number;

  @ApiProperty({ enum: BudgetCategoryEnum })
  CATEGORIA: BudgetCategoryEnum;

  @ApiProperty({
    enum: BaseEntityStatusEnum,
    example: BaseEntityStatusEnum.PENDENTE,
  })
  STATUS: BaseEntityStatusEnum;

  @ApiPropertyOptional({ example: 'Orçamneto de TI para o semestre' })
  OBSERVACAO: string | null;
}

export class BudgetResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: BudgetDataDto })
  data: BudgetDataDto;
}

export class BudgetListReponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [BudgetDataDto] })
  data: BudgetDataDto;
}

export class BudgetListResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: [BudgetDataDto] })
  data: BudgetDataDto[];
}
