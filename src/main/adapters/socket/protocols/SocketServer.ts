import { Socket } from 'socket.io';

export interface SocketServer {
  getConnectionSocket(
    callback?: (socketName: string) => Promise<void>,
  ): Promise<Socket>;
  getSocketById(id: string): Socket;
  clearAllListeners(): Promise<void>;
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
  setDisconnectionSocket(
    socket: Socket,
    callback: (playerName: string) => Promise<void>,
  ): Promise<void>;
}
