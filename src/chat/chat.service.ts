import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';
import { RHCORE_SYSTEM_PROMPT } from './prompts/system-prompt';
import { ConfigService } from '@nestjs/config';

const CHAT_MODEL = 'us.anthropic.claude-haiku-4-5-20251001-v1:0';
const CHAT_MAX_TOKENS = 4096;

@Injectable()
export class ChatService {
  private client?: AnthropicBedrock;

  constructor(private readonly configService: ConfigService) {}

  private getClient(): AnthropicBedrock {
    if (!this.client) {
      const awsRegion = this.configService.get<string>('AWS_REGION');
      if (!awsRegion) {
        throw new ServiceUnavailableException(
          'Assistente indisponível: AWS_REGION não configurada.',
        );
      }
      this.client = new AnthropicBedrock({ awsRegion });
    }
    return this.client;
  }

  async perguntar(mensagem: string): Promise<string> {
    try {
      const response = await this.getClient().messages.create({
        model: CHAT_MODEL,
        max_tokens: CHAT_MAX_TOKENS,
        system: RHCORE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: mensagem }],
      });
      const bloco = response.content.find((b) => b.type === 'text');
      return bloco?.type === 'text' ? bloco.text : '';
    } catch {
      throw new ServiceUnavailableException(
        'Assistente indisponível no momento. Tente novamente.',
      );
    }
  }
}
