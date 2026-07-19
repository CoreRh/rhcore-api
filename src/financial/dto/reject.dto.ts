import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RejectDto {
  @ApiProperty({ example: 'Despesa fora da política de reembolso' })
  @IsString({ message: 'O motivo deve ser texto' })
  @IsNotEmpty({ message: 'O motivo da rejeição é obrigatório' })
  @MaxLength(500, { message: 'O motivo deve ter no máximo 500 caracteres' })
  OBSERVACAO: string;
}
