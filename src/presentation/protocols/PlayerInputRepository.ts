import {
  AddInteractionResult,
  GameState,
  MovementInteractionResult,
} from '../../use-case/states/protocols';

export interface PlayerResult {
  id: string;
  name: string;
}

export interface PlayerInputRepository {
  getPlayer(): Promise<PlayerResult>;
  updateBoard(state: GameState): Promise<void>;
  getStartGame(state: GameState): Promise<void>;
  getPlayerTurnStart(state: GameState): Promise<void>;
  getPlayerAddPiece(state: GameState): Promise<AddInteractionResult>;
  getPlayerMovePiece(state: GameState): Promise<MovementInteractionResult>;
  getPlayerRemoveFoePiece(state: GameState): Promise<AddInteractionResult>;
  getGameOver(state: GameState): Promise<void>;
}
