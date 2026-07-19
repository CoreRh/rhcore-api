import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { BaseEntityStatusEnum } from 'src/common/enums/base-entity-status.enum';

export class UpdateBudgetDto extends PartialType(
  OmitType(CreateBudgetDto, ['DEPARTAMENTO_ID'] as const),
) {
  @ApiPropertyOptional({
    enum: [BaseEntityStatusEnum.ATIVO, BaseEntityStatusEnum.INATIVO],
  })
  @IsEnum(BaseEntityStatusEnum, { message: 'Status inválido' })
  @IsOptional()
  STATUS?: BaseEntityStatusEnum;
}
