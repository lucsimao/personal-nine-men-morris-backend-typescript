import { Chat, ChatMessage } from '../../domain/entities/Chat';
import { ChatService } from '../../domain/services/ChatService';
import { Logger } from '../../use-case/services/protocols/Logger';

export class ChatController {
  private chat: Chat;

  constructor(
    private readonly chatInputRepository: ChatService,
    private readonly logger: Logger,
  ) {
    this.chat = new Chat();
  }

  public async start() {
    await this.chatInputRepository.listenToChat(async (chat: ChatMessage) => {
      this.logger.info({
        service: 'chat',
        msg: `chat received`,
        chat: JSON.stringify(chat),
        user: chat.user,
      });
      this.chat.addMessage(chat);

      await this.chatInputRepository.updateChat<ChatMessage[]>(
        this.chat.getChatHistory(),
      );
      this.logger.info({
        service: 'update',
        msg: `update chat history`,
        chatHistory: JSON.stringify(this.chat.getChatHistory()),
      });
    });
  }
}
