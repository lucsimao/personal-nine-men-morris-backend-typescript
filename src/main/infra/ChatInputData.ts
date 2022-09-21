import { ChatInputRepository } from '../../presentation/protocols/ChatInputRepository';
import { ChatInputClient } from './protocols/ChatInputClient';
import { Logger } from './protocols/Logger';

export class ChatInputData implements ChatInputRepository {
  constructor(
    private readonly chatInputClient: ChatInputClient,
    private readonly logger: Logger,
  ) {}

  public async listenToChat<T>(
    callback: (response: T) => Promise<void>,
  ): Promise<void> {
    await this.chatInputClient.listenToChat('chat', callback);
  }

  public async updateChat<T>(chat: T): Promise<void> {
    await this.chatInputClient.updateChat('chat', chat);
  }
}
