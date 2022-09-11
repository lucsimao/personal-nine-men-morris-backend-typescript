import { Server } from 'socket.io';

import { SocketInputAdapter } from '../adapters/SocketInputAdapter';
import { SocketServerData } from '../adapters/SocketServerData';

export const makeInputClient = (server: Server) => {
  const socketServer = new SocketServerData(server);
  const result = new SocketInputAdapter(socketServer);

  return result;
};
