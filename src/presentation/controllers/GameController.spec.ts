import { GameState } from '../../use-case/states/protocols';
import { PlayerInputRepository } from '../protocols/PlayerInputRepository';
import { GameController } from './GameController';

const makePlayerInputRepository = (): jest.Mocked<PlayerInputRepository> => ({
  getGameOver: jest.fn(),
  getPlayer: jest.fn().mockResolvedValue({ id: 1, name: 'Some player' }),
  getPlayerAddPiece: jest.fn().mockResolvedValue(null),
  getPlayerMovePiece: jest.fn().mockResolvedValue(null),
  getPlayerRemoveFoePiece: jest.fn().mockResolvedValue(null),
  getPlayerTurnStart: jest.fn(),
  getStartGame: jest.fn(),
  updateBoard: jest.fn(),
});

const makeSut = () => {
  const playerInputRepository = makePlayerInputRepository();
  const sut = new GameController(playerInputRepository);

  return { sut, playerInputRepository };
};

const mockLinkedValues = (
  func: jest.MockInstance<Promise<{ position: number }>, GameState[]>,
  values: number[],
) => {
  for (const value of values) {
    func.mockResolvedValueOnce({ position: value });
  }
};
const mockMovementLinkedValues = (
  func: jest.MockInstance<
    Promise<{ position: number; targetPosition: number }>,
    GameState[]
  >,
  values: number[][],
) => {
  for (const value of values) {
    const [position, targetPosition] = value;
    func.mockResolvedValueOnce({ position, targetPosition });
  }
};
describe('Game Controller', () => {
  describe('when start game', () => {
    describe('should complete game', () => {
      test('when complete a match', async () => {
        const { sut, playerInputRepository } = makeSut();
        mockLinkedValues(
          playerInputRepository.getPlayerAddPiece,
          [1, 2, 4, 3, 6, 2, 8, 18, 7, 12, 3, 23, 5, 19, 2, 19, 13, 24],
        );
        mockLinkedValues(
          playerInputRepository.getPlayerRemoveFoePiece,
          [2, 3, 2, 19, 21, 19, 24],
        );
        mockMovementLinkedValues(playerInputRepository.getPlayerMovePiece, [
          [5, 14],
          [23, 21],
          [14, 5],
          [19, 20],
          [5, 14],
          [20, 19],
          [14, 5],
          [18, 17],
          [5, 14],
          [17, 18],
          [14, 5],
        ]);

        await sut.start();

        expect(true);
      });

      test(' when receive invalid entries sometimes', async () => {
        const { sut, playerInputRepository } = makeSut();
        mockLinkedValues(
          playerInputRepository.getPlayerAddPiece,
          [1, 1, 2, 4, 3, 6, 2, 8, 18, 7, 12, 3, 23, 5, 19, 2, 19, 13, 24],
        );
        mockLinkedValues(
          playerInputRepository.getPlayerRemoveFoePiece,
          [2, 3, 2, 19, 21, 19, 24],
        );
        mockMovementLinkedValues(playerInputRepository.getPlayerMovePiece, [
          [5, 14],
          [23, 21],
          [14, 5],
          [19, 20],
          [5, 14],
          [20, 19],
          [14, 5],
          [18, 17],
          [5, 14],
          [17, 18],
          [14, 5],
        ]);

        await sut.start();

        expect(true);
      });
    });
    describe('should not complete game', () => {
      test('when some unhandled error ocurred', async () => {
        const { sut, playerInputRepository } = makeSut();
        playerInputRepository.getPlayerAddPiece.mockRejectedValueOnce(
          new Error('some add piece error'),
        );

        const promise = sut.start();

        await expect(promise).rejects.toThrow(
          new Error('some add piece error'),
        );
      });
    });
  });
});
