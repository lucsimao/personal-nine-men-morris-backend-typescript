import { PlayerResult } from '../../../presentation/protocols/PlayerInputRepository';
import {
  AddInteractionResult,
  GameState,
} from '../../../use-case/states/protocols';
import { PlayerInputClient } from '../../infra/protocols/PlayerInputClient';
import { SocketServer } from './protocols/SocketServer';

export class SocketInputAdapter implements PlayerInputClient {
  constructor(private readonly socketServer: SocketServer) {}

  public async getPlayer(): Promise<PlayerResult> {
    const { id } = await this.socketServer.getConnectionSocket();

    return { id, name: id };
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
