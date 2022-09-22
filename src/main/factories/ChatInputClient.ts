import { Server } from 'socket.io';

import { SocketServerData } from '../adapters';
import { ChatSocketInputAdapter } from '../adapters/socket/ChatSocketInputAdapter';

export const makeChatInputClient = (server: Server) => {
  const socketServer = new SocketServerData(server);
  const result = new ChatSocketInputAdapter(socketServer);

  return result;
};
