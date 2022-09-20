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
import { Logger } from './protocols/Logger';
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
  constructor(
    private readonly playerInputClient: PlayerInputClient,
    private readonly logger: Logger,
  ) {}

  public async getPlayer(): Promise<PlayerResult> {
    const result = await this.playerInputClient.getPlayer(
      async (playerName: string) => {
        this.logger.info({
          msg: `Player ${playerName} has disconnected`,
          playerName: playerName,
        });
        await this.playerInputClient.clearPlayerListeners();
      },
    );

    return result;
  }

  public async setWatcherPlayerConnection() {
    void this.playerInputClient.setDefaultWatcherConnection(
      async (playerName: string) => {
        this.logger.info({
          msg: `Player ${playerName} has joined as watcher`,
          playerName: playerName,
        });
      },
    );
  }

  public async updateBoard(state: GameState): Promise<void> {
    this.logger.info({
      msg: `updating board: ${state.name}`,
      gameInfo: state.gameInfo,
    });
    await this.playerInputClient.sendEventToAllPlayers(
      { name: 'update-board' } as unknown as GameState,
      state.gameInfo,
    );
  }

  public async getStartGame(state: GameState): Promise<void> {
    this.logger.info({
      msg: `starting game`,
    });
    await this.playerInputClient.sendEventToAllPlayers(state, START_GAME);
  }

  public async getPlayerTurnStart(state: GameState): Promise<void> {
    const playerName = state.gameInfo.player.name;
    this.logger.info({
      msg: `player turn ${playerName}`,
    });
    await this.playerInputClient.sendEventToAllPlayers(
      state,
      PLAYER_TURN(playerName),
    );
  }

  public async getPlayerAddPiece(
    state: GameState,
  ): Promise<AddInteractionResult> {
    const playerName = state.gameInfo.player.name;
    this.logger.info({
      msg: `player add piece state ${playerName}`,
    });
    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE(playerName),
    );
    this.logger.info({
      msg: `waiting player add piece command ${playerName}`,
    });
    const { position } = await this.playerInputClient.getInput(state);

    return { position };
  }

  public async getPlayerMovePiece(
    state: GameState,
  ): Promise<MovementInteractionResult> {
    const playerName = state.gameInfo.player.name;
    this.logger.info({
      msg: `player move piece state ${playerName}`,
    });
    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE_TO_MOVE(playerName),
    );
    this.logger.info({
      msg: `waiting player move piece command ${playerName}`,
    });
    const { position } = await this.playerInputClient.getInput(state);

    const availablePositions =
      state.gameInfo.board.getAvailableNeighbors(position);
    this.logger.info({
      msg: `available positions to move ${playerName}`,
      availablePositions: availablePositions,
    });
    await this.playerInputClient.sendEventToPlayer(state, availablePositions);
    this.logger.info({
      msg: `waiting player target move piece command ${playerName}`,
    });
    const { position: targetPosition } = await this.playerInputClient.getInput(
      state,
    );

    return { position, targetPosition };
  }

  public async getPlayerRemoveFoePiece(
    state: GameState,
  ): Promise<AddInteractionResult> {
    const playerName = state.gameInfo.player.name;
    this.logger.info({
      msg: `player remove foe piece ${playerName}`,
    });
    await this.playerInputClient.sendEventToPlayer(
      state,
      CHOOSE_PIECE_TO_REMOVE(playerName),
    );
    this.logger.info({
      msg: `waiting player remove piece command ${playerName}`,
    });
    const { position } = await this.playerInputClient.getInput(state);

    return { position };
  }

  public async getGameOver(state: GameState): Promise<void> {
    const playerName = state.gameInfo.player.name;
    this.logger.info({
      msg: `game over ${playerName}`,
    });
    await this.playerInputClient.sendEventToAllPlayers(state, state.gameInfo);
    await this.playerInputClient.sendEventToPlayer(
      state,
      GAME_OVER(playerName),
    );
  }
}
