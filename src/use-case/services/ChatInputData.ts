import { ChatService } from '../../domain/services/ChatService';
import { ChatRepository } from './protocols/ChatRepository';
import { Logger } from './protocols/Logger';

export class ChatInputData implements ChatService {
  constructor(
    private readonly chatInputClient: ChatRepository,
    private readonly logger: Logger,
  ) {}

  public async listenToChat<T>(
    callback: (response: T) => Promise<void>,
  ): Promise<void> {
    this.logger.info({
      type: 'chat',
      msg: `listening to chat`,
    });
    await this.chatInputClient.listenToChat('chat', callback);
  }

  public async updateChat<T>(chat: T): Promise<void> {
    this.logger.info({
      type: 'chat',
      msg: `updating chat`,
      chat: chat,
    });
    await this.chatInputClient.updateChat('chat', chat);
  }
}
