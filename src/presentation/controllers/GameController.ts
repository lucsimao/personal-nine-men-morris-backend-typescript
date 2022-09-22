import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { InvalidInteractionError } from '../../domain/errors/InvalidInteractionError';
import { PlayerService } from '../../domain/services/PlayerService';
import { State } from '../../domain/state/enum/State';
import { GameState } from '../../domain/state/GameState';
import { SocketTimeoutError } from '../../main/decorator/errors/SocketTimeoutError';
import { Logger } from '../../use-case/services/protocols/Logger';
import { StartGameState } from '../../use-case/states';

const getValidInteraction = (
  state: GameState,
  playerInputRepository: PlayerService,
): ((state?: GameState) => unknown) => {
  const validInteractions = {
    [State.START_GAME]: async () => {
      const result = await playerInputRepository.getStartGame(state);

      return result;
    },
    [State.PLAYER_TURN_START]: async () => {
      const result = await playerInputRepository.getPlayerTurnStart(state);

      return result;
    },
    [State.PLAYER_ADD_PIECE]: async () => {
      const result = await playerInputRepository.getPlayerAddPiece(state);

      return result;
    },
    [State.PLAYER_MOVE_PIECE]: async () => {
      const result = await playerInputRepository.getPlayerMovePiece(state);

      return result;
    },
    [State.PLAYER_REMOVE_FOE_PIECE]: async () => {
      const result = await playerInputRepository.getPlayerRemoveFoePiece(state);

      return result;
    },
    [State.GAME_OVER]: async () => {
      const result = await playerInputRepository.getGameOver(state);

      return result;
    },
  };
  return validInteractions[state.name];
};

export class GameController {
  constructor(
    private readonly playerInputRepository: PlayerService,
    private readonly logger: Logger,
  ) {}

  public async start({
    player,
    foe,
  }: {
    player: Player;
    foe: Player;
  }): Promise<void> {
    const board = new Board();

    let state: GameState<void | unknown> | null = new StartGameState({
      board,
      player,
      foe,
    });
    this.logger.info({
      msg: `starting game`,
      state: state.name,
      board: state.gameInfo,
    });
    while (state) {
      try {
        const interaction = getValidInteraction(
          state,
          this.playerInputRepository,
        );

        state = await state.exec(interaction);
        if (state) await this.playerInputRepository.updateBoard(state);
      } catch (error) {
        if (error instanceof SocketTimeoutError) {
          this.logger.error({
            msg: `player ${error.socketName} timed out`,
            error: error,
            message: error.message,
          });
          throw error;
        }
        if (!(error instanceof InvalidInteractionError)) {
          throw error;
        }

        this.logger.warning({
          msg: `invalid command`,
          error: error,
          message: error.message,
        });
      }
    }
  }

  public async setupPlayers(): Promise<{ player: Player; foe: Player }> {
    this.logger.info({
      msg: `waiting for player 1 connection`,
    });
    const player1 = await this.playerInputRepository.getPlayer();
    this.logger.info({
      msg: `player1 connected`,
      playerName: player1.name,
    });
    this.logger.info({
      msg: `waiting for player 2 connection`,
    });
    const player2 = await this.playerInputRepository.getPlayer();
    this.logger.info({
      msg: `player2 connected`,
      playerName: player2.name,
    });

    await this.playerInputRepository.setWatcherPlayerConnection();

    const player = new Player(player1.id, player1.name, PositionStatus.BLACK);
    const foe = new Player(player2.id, player2.name, PositionStatus.WHITE);

    return { player, foe };
  }
}
