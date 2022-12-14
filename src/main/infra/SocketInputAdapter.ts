import { PlayerResult } from '../../domain/services/PlayerService';
import { GameState } from '../../domain/state/GameState';
import { PlayerRepository } from '../../use-case/services/protocols/PlayerRepository';
import { AddInteractionResult } from '../../use-case/states/protocols/AddInteractionResult';
import { SocketServer } from './protocols/SocketServer';

export class SocketInputAdapter implements PlayerRepository {
  constructor(private readonly socketServer: SocketServer) {}

  public async getPlayer(
    disconnectionCallback: (playerName: string) => Promise<void>,
  ): Promise<PlayerResult> {
    const playerSocket = await this.socketServer.getConnectionSocket();
    await this.socketServer.setDisconnectionSocket(
      playerSocket,
      disconnectionCallback,
    );

    return { id: playerSocket.id, name: playerSocket.id };
  }

  public async setDefaultWatcherConnection(
    callback: (playerName: string) => Promise<void>,
  ) {
    await this.socketServer.getConnectionSocket(callback);
  }

  public async clearPlayerListeners(): Promise<void> {
    await this.socketServer.clearAllListeners();
  }

  async getInput(state: GameState): Promise<AddInteractionResult> {
    const playerName = state.gameInfo.player.name;
    const player = await this.socketServer.getSocketById(playerName);
    const result = await this.socketServer.listenToEventFromSpecificClient(
      player,
      state.name,
    );

    return JSON.parse(result) as AddInteractionResult;
  }

  async sendEventToPlayer<T>(state: GameState, message: T): Promise<void> {
    const playerName = state.gameInfo.player.name;
    const player = await this.socketServer.getSocketById(playerName);

    return await this.socketServer.emitSocketEventToSpecificClient(
      player,
      state.name,
      message,
    );
  }

  async sendEventToAllPlayers<T>(state: GameState, message: T): Promise<void> {
    return await this.socketServer.emitSocketEventToAllClients(
      state.name,
      message,
    );
  }
}
