import { Server } from 'socket.io';

import { ChatController } from '../../presentation/controllers/ChatControlller';
import { Logger } from '../infra/protocols/Logger';
import { makeChatInputRepository } from './ChatInputRepository';

export const makeChatController = (server: Server, logger: Logger) => {
  const chatInputRepository = makeChatInputRepository(server, logger);
  const result = new ChatController(chatInputRepository, logger);

  return result;
};
