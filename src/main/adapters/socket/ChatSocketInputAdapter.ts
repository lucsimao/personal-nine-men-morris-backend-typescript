import { ChatInputClient } from '../../infra/protocols/ChatInputClient';
import { SocketServer } from './protocols/SocketServer';

export class ChatSocketInputAdapter implements ChatInputClient {
  constructor(private readonly socketServer: SocketServer) {}

  public async listenToChat<T>(
    event: string,
    callback: (response: T) => Promise<void>,
  ): Promise<void> {
    await this.socketServer.listenAsyncToEventFromAllClients<T>(
      event,
      callback,
    );
  }

  public async updateChat<T>(event: string, chat: T): Promise<void> {
    await this.socketServer.emitSocketEventToAllClients<T>(event, chat);
  }
}
