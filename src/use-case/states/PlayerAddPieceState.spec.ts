import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { TakenPositionError } from '../../domain/errors';
import { PlayerAddPieceState } from './PlayerAddPieceState';
import { PlayerRemoveFoePieceState } from './PlayerRemoveFoePieceState';
import { PlayerTurnStartState } from './PlayerTurnStartState';

const makeGameInfo = () => {
  const board = new Board();
  board.add(20, PositionStatus.BLACK);
  const player = new Player('player1', 'player1', PositionStatus.BLACK);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE);

  return { board, player, foe };
};

const makeSut = () => {
  const gameInfo = makeGameInfo();
  const sut = new PlayerAddPieceState(gameInfo);

  return { sut, gameInfo };
};

describe('Player Add Piece', () => {
  test('should return player turn start when addition does not form a mill', async () => {
    const { sut, gameInfo } = makeSut();

    const result = await sut.exec(() => ({ position: 16 }));

    expect(result).toEqual(
      new PlayerTurnStartState({
        ...gameInfo,
        player: gameInfo.foe,
        foe: gameInfo.player,
      }),
    );
  });

  test('should return player turn start when addition forms a mill', async () => {
    const { sut, gameInfo } = makeSut();
    gameInfo.board.add(10, PositionStatus.BLACK);
    gameInfo.board.add(15, PositionStatus.BLACK);
    const result = await sut.exec(() => ({ position: 16 }));

    expect(result).toEqual(new PlayerRemoveFoePieceState(gameInfo));
  });

  describe('should not return next state', () => {
    test('when interaction fails', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => {
        throw new Error('Any interaction error');
      });

      await expect(promise).rejects.toThrow(new Error('Any interaction error'));
    });

    test('when addition fails due to invalid position', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => ({
        position: 20,
      }));

      await expect(promise).rejects.toThrow(
        new TakenPositionError(20, 'cannot add piece'),
      );
    });
  });
});
