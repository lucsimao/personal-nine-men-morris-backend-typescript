import { PlayerResult } from '../../../domain/services/PlayerService';
import { GameState } from '../../../domain/state/GameState';
import { AddInteractionResult } from '../../states/protocols/AddInteractionResult';

export interface PlayerRepository {
  sendEventToAllPlayers<T>(state: GameState, message: T): Promise<void>;
  getPlayer(
    disconnectionCallback: (playerName: string) => Promise<void>,
  ): Promise<PlayerResult>;
  getInput(state: GameState): Promise<AddInteractionResult>;
  sendEventToPlayer<T>(state: GameState, message: T): Promise<void>;
  setDefaultWatcherConnection(
    callback: (playerName: string) => Promise<void>,
  ): Promise<void>;
  clearPlayerListeners(): Promise<void>;
}
