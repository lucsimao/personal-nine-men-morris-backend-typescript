import { Server, Socket } from 'socket.io';

import { SocketServer } from './protocols/SocketServer';

export class SocketServerData implements SocketServer {
  constructor(private readonly server: Server) {}

  public async getConnectionSocket(): Promise<Socket> {
    return new Promise(resolve =>
      this.server.on('connection', (socket: Socket) => {
        resolve(socket);
      }),
    );
  }

  public getSocketById(id: string): Socket {
    const result = this.server.sockets.sockets.get(id);

    if (!result) {
      throw new Error('socket not found');
    }

    return result;
  }

  public async listenToEventFromSpecificClient(
    socket: Socket,
    eventName: string,
  ): Promise<string> {
    return new Promise(resolve => {
      socket.on(eventName, response => {
        resolve(response);
      });
    });
  }

  public async listenToEventFromAllClients(event: string) {
    return new Promise(resolve => {
      this.server.on(event, response => {
        resolve(response);
      });
    });
  }

  async listenAsyncToEventFromSpecificClient(
    socket: Socket,
    event: string,
    callback: CallableFunction,
  ): Promise<void> {
    socket.on(event, response => {
      callback(response);
    });
  }

  async emitSocketEventToSpecificClient<T>(
    socket: Socket,
    event: string,
    message: T,
  ): Promise<void> {
    return new Promise(resolve => {
      socket.emit(event, message);
      resolve();
    });
  }

  async emitSocketEventToAllClients<T>(
    event: string,
    message: T,
  ): Promise<void> {
    return new Promise(resolve => {
      this.server.emit(event, message);
      resolve();
    });
  }
}
