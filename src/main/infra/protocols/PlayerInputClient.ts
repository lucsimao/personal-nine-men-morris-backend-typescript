import { PlayerResult } from '../../../presentation/protocols/PlayerInputRepository';
import {
  AddInteractionResult,
  GameState,
} from '../../../use-case/states/protocols';

export interface PlayerInputClient {
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
