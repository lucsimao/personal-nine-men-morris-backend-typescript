import {
  PlayerInputRepository,
  PlayerResult,
} from '../../presentation/protocols/PlayerInputRepository';
import {
  GameState,
  AddInteractionResult,
  MovementInteractionResult,
} from '../../use-case/states/protocols';
import { Message } from '../config/Message';
import { PlayerInputClient } from './protocols/PlayerInputClient';

const {
  START_GAME,
  CHOOSE_PIECE,
  CHOOSE_PIECE_TO_MOVE,
  PLAYER_TURN,
  CHOOSE_PIECE_TO_REMOVE,
  GAME_OVER,
} = Message;

export class PlayerInputData implements PlayerInputRepository {
  constructor(private readonly playerInputClient: PlayerInputClient) {}

  public async getPlayer(): Promise<PlayerResult> {
    const result = await this.playerInputClient.getPlayer();

    return result;
  }

  public async updateBoard(state: GameState<unknown>): Promise<void> {
    await this.playerInputClient.sendEventToAllPlayers(
      { name: 'update-board' } as unknown as GameState,
      state.gameInfo,
    );
  }

  public async getStartGame(state: GameState<unknown>): Promise<void> {
    await this.playerInputClient.sendEventToAllPlayers(state, START_GAME);
  }

  public async getPlayerTurnStart(state: GameState<unknown>): Promise<void> {
    const playerName = state.gameInfo.player.name;

    await this.playerInputClient.sendEventToAllPlayers(
      state,
      PLAYER_TURN(playerName),
    );
  }

  public async getPlayerAddPiece(
    state: GameState<unknown>,
  ): Promise<AddInteractionResult> {
    const playerName = state.gameInfo.player.name;

    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE(playerName),
    );
    const { position } = await this.playerInputClient.getInput(state);

    return { position };
  }

  public async getPlayerMovePiece(
    state: GameState<unknown>,
  ): Promise<MovementInteractionResult> {
    const playerName = state.gameInfo.player.name;

    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE_TO_MOVE(playerName),
    );
    const { position } = await this.playerInputClient.getInput(state);

    const availablePositions =
      state.gameInfo.board.getAvailableNeighbors(position);
    await this.playerInputClient.sendEventToPlayer(state, availablePositions);
    const { position: targetPosition } = await this.playerInputClient.getInput(
      state,
    );

    return { position, targetPosition };
  }

  public async getPlayerRemoveFoePiece(
    state: GameState<unknown>,
  ): Promise<AddInteractionResult> {
    const playerName = state.gameInfo.player.name;

    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE_TO_REMOVE(playerName),
    );
    const { position } = await this.playerInputClient.getInput(state);

    return { position };
  }

  public async getGameOver(state: GameState<unknown>): Promise<void> {
    const playerName = state.gameInfo.player.name;

    await this.playerInputClient.sendEventToAllPlayers(state, state.gameInfo);
    await this.playerInputClient.sendEventToPlayer(
      state,
      GAME_OVER(playerName),
    );
  }
}
