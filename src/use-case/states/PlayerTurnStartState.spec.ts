import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { PlayerAddPieceState } from './PlayerAddPieceState';
import { PlayerMovePieceState } from './PlayerMovePieceState';
import { PlayerTurnStartState } from './PlayerTurnStartState';

const makeGameInfo = () => {
  const board = new Board();
  board.add(20, PositionStatus.BLACK);
  const player = new Player('player1', 'player1', PositionStatus.BLACK, 3);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE);

  return { board, player, foe };
};

const makeSut = () => {
  const gameInfo = makeGameInfo();
  const sut = new PlayerTurnStartState(gameInfo);

  return { sut, gameInfo };
};

describe('Player Start Turn', () => {
  test('should return player add piece when player still has pieces in hand', async () => {
    const { sut, gameInfo } = makeSut();

    const result = await sut.exec(() => ({}));

    expect(result).toEqual(new PlayerAddPieceState(gameInfo));
  });

  test('should return player move piece when player has no pieces in hand', async () => {
    const { sut, gameInfo } = makeSut();
    gameInfo.player.add();
    gameInfo.player.add();
    gameInfo.player.add();

    const result = await sut.exec(() => ({}));

    expect(result).toEqual(new PlayerMovePieceState(gameInfo));
  });

  describe('should not return next state', () => {
    test('when interaction fails', async () => {
      const { sut } = makeSut();

      const promise = sut.exec(() => {
        throw new Error('Any interaction error');
      });

      await expect(promise).rejects.toThrow(new Error('Any interaction error'));
    });
  });
});
