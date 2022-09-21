import { Server } from 'socket.io';

import { ChatInputData } from '../infra/ChatInputData';
import { Logger } from '../infra/protocols/Logger';
import { makeChatInputClient } from './ChatInputClient';

export const makeChatInputRepository = (server: Server, logger: Logger) => {
  const inputClient = makeChatInputClient(server);
  const result = new ChatInputData(inputClient, logger);

  return result;
};
