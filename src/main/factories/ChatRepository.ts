import { Server } from 'socket.io';

import { SocketServerData } from '../adapters';
import { ChatSocketInputAdapter } from '../infra/ChatSocketInputAdapter';

export const makeChatRepository = (server: Server) => {
  const socketServer = new SocketServerData(server);
  const result = new ChatSocketInputAdapter(socketServer);

  return result;
};
