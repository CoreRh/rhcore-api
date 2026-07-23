import { ApiProperty } from '@nestjs/swagger';
import { BaseSuccessResponseDto } from 'src/common/dto/base-response.dto';

export class ChatDataDto {
  @ApiProperty({
    example: 'O fluxo de aprovações de despesas funciona assim...',
  })
  RESPOSTA: string;
}

export class ChatResponseDto extends BaseSuccessResponseDto {
  @ApiProperty({ type: ChatDataDto })
  data: ChatDataDto;
}
