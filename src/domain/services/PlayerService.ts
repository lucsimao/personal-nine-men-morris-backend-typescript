import { AddInteractionResult } from '../../use-case/states/protocols/AddInteractionResult';
import { MovementInteractionResult } from '../../use-case/states/protocols/MovementInteractionResult';
import { GameState } from '../state/GameState';

export interface PlayerResult {
  id: string;
  name: string;
}

export interface PlayerService {
  getPlayer(): Promise<PlayerResult>;
  setWatcherPlayerConnection(): Promise<void>;
  updateBoard(state: GameState): Promise<void>;
  getStartGame(state: GameState): Promise<void>;
  getPlayerTurnStart(state: GameState): Promise<void>;
  getPlayerAddPiece(state: GameState): Promise<AddInteractionResult>;
  getPlayerMovePiece(state: GameState): Promise<MovementInteractionResult>;
  getPlayerRemoveFoePiece(state: GameState): Promise<AddInteractionResult>;
  getGameOver(state: GameState): Promise<void>;
}
