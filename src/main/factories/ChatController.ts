import { Server } from 'socket.io';

import { ChatController } from '../../presentation/controllers/ChatControlller';
import { Logger } from '../../use-case/services/protocols/Logger';
import { makeChatService } from './ChatService';

export const makeChatController = (server: Server, logger: Logger) => {
  const chatInputRepository = makeChatService(server, logger);
  const result = new ChatController(chatInputRepository, logger);

  return result;
};
