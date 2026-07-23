import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ChatResponseDto } from './dto/chat-response.dto';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import { ChatRequestDto } from './dto/chat-request.dto';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({
    summary: 'Perguntar ao assistente',
    description: 'Envia uma pergunta ao assistente virtual do RHCore.',
  })
  @ApiResponse({
    status: 201,
    description: 'Resposta gerada com sucesso.',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, type: BadRequestResponseDto })
  @ApiResponse({ status: 401, type: UnauthorizedResponseDto })
  @ApiResponse({
    status: 503,
    description:
      'Assistente indisponível (falha ao consultar o provedor de IA).',
  })
  async perguntar(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    const resposta = await this.chatService.perguntar(dto.MENSAGEM);
    return {
      succeeded: true,
      data: { RESPOSTA: resposta },
      message: 'Resposta gerada com sucesso.',
    };
  }
}
