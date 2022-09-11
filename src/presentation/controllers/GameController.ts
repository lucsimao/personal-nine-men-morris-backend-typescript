import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { InvalidInteractionError } from '../../domain/errors/InvalidInteractionError';
import { Logger } from '../../main/infra/protocols/Logger';
import { StartGameState } from '../../use-case/states';
import { State } from '../../use-case/states/enum/State';
import { GameState } from '../../use-case/states/protocols';
import { PlayerInputRepository } from '../protocols/PlayerInputRepository';

const getValidInteraction = (
  state: GameState,
  playerInputRepository: PlayerInputRepository,
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
    private readonly playerInputRepository: PlayerInputRepository,
    private readonly logger: Logger,
  ) {}

  public async start(): Promise<void> {
    const { player, foe } = await this.setupPlayer();
    const board = new Board();

    let state: GameState<void | unknown> | null = new StartGameState({
      board,
      player,
      foe,
    });
    while (state) {
      try {
        this.logger.info({
          msg: `starting game`,
          state: state.name,
          board: state.gameInfo,
        });
        const interaction = getValidInteraction(
          state,
          this.playerInputRepository,
        );

        state = await state.exec(interaction);
        if (state) await this.playerInputRepository.updateBoard(state);
      } catch (error) {
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

  private async setupPlayer(): Promise<{ player: Player; foe: Player }> {
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

    const player = new Player(player1.id, player1.name, PositionStatus.BLACK);
    const foe = new Player(player2.id, player2.name, PositionStatus.WHITE);

    return { player, foe };
  }
}
