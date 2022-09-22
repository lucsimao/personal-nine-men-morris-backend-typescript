import { Server } from 'socket.io';

import { ChatInputData } from '../../use-case/services/ChatInputData';
import { Logger } from '../../use-case/services/protocols/Logger';
import { makeChatRepository } from './ChatRepository';

export const makeChatService = (server: Server, logger: Logger) => {
  const inputClient = makeChatRepository(server);
  const result = new ChatInputData(inputClient, logger);

  return result;
};
