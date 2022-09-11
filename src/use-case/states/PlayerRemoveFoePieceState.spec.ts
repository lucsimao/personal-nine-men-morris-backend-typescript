import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { EmptyPositionError, InvalidPositionError } from '../../domain/errors';
import { GameOverState } from './GameOverState';
import { PlayerRemoveFoePieceState } from './PlayerRemoveFoePieceState';
import { PlayerTurnStartState } from './PlayerTurnStartState';

const makeGameInfo = () => {
  const board = new Board();
  board.add(20, PositionStatus.BLACK);
  const player = new Player('player1', 'player1', PositionStatus.BLACK);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE, 4);

  return { board, player, foe };
};

const makeSut = () => {
  const gameInfo = makeGameInfo();
  const sut = new PlayerRemoveFoePieceState(gameInfo);

  return { sut, gameInfo };
};

describe('Player Remove Piece', () => {
  test('should return player turn start when foe has more than 3 pieces', async () => {
    const { sut, gameInfo } = makeSut();
    gameInfo.board.add(10, PositionStatus.WHITE);

    const result = await sut.exec(() => ({ position: 10 }));

    expect(result).toEqual(
      new PlayerTurnStartState({
        ...gameInfo,
        player: gameInfo.foe,
        foe: gameInfo.player,
      }),
    );
  });

  test('should return player turn start when foe has equal or less than 3 pieces', async () => {
    const { sut, gameInfo } = makeSut();
    gameInfo.board.add(10, PositionStatus.WHITE);
    gameInfo.foe.remove();

    const result = await sut.exec(() => ({ position: 10 }));

    expect(result).toEqual(new GameOverState(gameInfo));
  });

  describe('should not return next state', () => {
    test('when interaction fails', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => {
        throw new Error('Any interaction error');
      });

      await expect(promise).rejects.toThrow(new Error('Any interaction error'));
    });

    test('when remotion fails due to piece as same status', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => ({
        position: 20,
      }));

      await expect(promise).rejects.toThrow(
        new InvalidPositionError(
          20,
          'cannot remove piece with same player status',
        ),
      );
    });

    test('when remotion fails due to empty position', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => ({
        position: 1,
      }));

      await expect(promise).rejects.toThrow(
        new EmptyPositionError(1, 'cannot remove piece'),
      );
    });
  });
});
