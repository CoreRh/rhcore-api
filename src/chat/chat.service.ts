import { Injectable } from '@nestjs/common';
import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';
import { RHCORE_SYSTEM_PROMPT } from './prompts/system-prompt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly client: AnthropicBedrock;

  constructor(private readonly configService: ConfigService) {
    this.client = new AnthropicBedrock({
      awsRegion: this.configService.getOrThrow<string>('AWS_REGION'),
    });
  }

  async perguntar(mensagem: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      max_tokens: 4096,
      system: RHCORE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: mensagem }],
    });

    const bloco = response.content.find((b) => b.type === 'text');
    return bloco?.type === 'text' ? bloco.text : '';
  }
}
