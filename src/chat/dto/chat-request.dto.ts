import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({ example: 'Como funciona o fluxo de aprovação de despesas' })
  @IsString({ message: 'A mensagem deve ser texto' })
  @IsNotEmpty({ message: 'A mensagem é obrigatório' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres' })
  MENSAGEM: string;
}
