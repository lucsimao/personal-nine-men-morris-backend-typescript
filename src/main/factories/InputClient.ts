import { Server } from 'socket.io';

import { SocketInputAdapter, SocketServerData } from '../adapters/';

export const makeInputClient = (server: Server) => {
  const socketServer = new SocketServerData(server);
  const result = new SocketInputAdapter(socketServer);

  return result;
};
