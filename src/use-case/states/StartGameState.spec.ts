import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { PlayerTurnStartState } from './PlayerTurnStartState';
import { StartGameState } from './StartGameState';

const makeGameInfo = () => {
  const board = new Board();
  board.add(20, PositionStatus.BLACK);
  const player = new Player('player1', 'player1', PositionStatus.BLACK, 3);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE);

  return { board, player, foe };
};

const makeSut = () => {
  const gameInfo = makeGameInfo();
  const sut = new StartGameState(gameInfo);

  return { sut, gameInfo };
};

describe('Player Start Turn', () => {
  test('should return null', async () => {
    const { sut, gameInfo } = makeSut();

    const result = await sut.exec(() => ({}));

    expect(result).toEqual(new PlayerTurnStartState(gameInfo));
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
