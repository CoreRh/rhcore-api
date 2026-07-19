import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSalaryAdvanceDto } from './create-salary-advance.dto';

export class UpdateSalaryAdvanceDto extends PartialType(
  OmitType(CreateSalaryAdvanceDto, ['FUNCIONARIO_ID'] as const),
) {}
