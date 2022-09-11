import { Socket } from 'socket.io';

export interface SocketServer {
  getConnectionSocket(): Promise<{ id: string }>;
  getSocketById(id: string): Socket;
  listenToEventFromSpecificClient(
    socket: Socket,
    eventName: string,
  ): Promise<string>;
  emitSocketEventToAllClients<T>(eventName: string, message: T): Promise<void>;
  emitSocketEventToSpecificClient<T>(
    socket: Socket,
    eventName: string,
    message: T,
  ): Promise<void>;
}
