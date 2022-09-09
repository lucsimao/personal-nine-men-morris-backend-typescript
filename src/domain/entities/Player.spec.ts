import { PositionStatus } from '../enum/PositionStatus';
import { InvalidStartPiecesError } from '../errors';
import { EmptyHandError } from '../errors/EmptyHandError';
import { LessThanThreeMenError } from '../errors/LessThanThreeMenError';
import { Player } from './Player';

describe('Player', () => {
  describe('when creating player', () => {
    test('should create player with success', () => {
      const player = new Player('1', 'Any name', PositionStatus.BLACK, 9);

      expect(player.name).toEqual('Any name');
      expect(player.id).toEqual('1');
      expect(player.color).toEqual(PositionStatus.BLACK);
      expect(player.piecesInHand).toEqual(9);
      expect(player.gamePieces).toEqual(9);
    });

    test('should not create player when receive start pieces', () => {
      expect(
        () => new Player('1', 'Any name', PositionStatus.BLACK, 2),
      ).toThrow(new InvalidStartPiecesError(2));
    });
  });

  describe('when adding pieces', () => {
    describe('should subtract pieces in hand', () => {
      test('when receive valid value', () => {
        const player = new Player('1', 'Any name', PositionStatus.BLACK, 9);

        player.add();

        expect(player.piecesInHand).toEqual(8);
      });
    });

    describe('should not subtract pieces in hand', () => {
      test('when try add without pieces in hand', () => {
        const player = new Player('1', 'Any name', PositionStatus.BLACK, 3);

        player.add();
        player.add();
        player.add();

        expect(() => player.add()).toThrow(
          new EmptyHandError('cannot add piece'),
        );
      });
    });
  });

  describe('when removing pieces', () => {
    describe('should subtract game pieces', () => {
      test('when receive valid value', () => {
        const player = new Player('1', 'Any name', PositionStatus.BLACK, 9);

        player.remove();

        expect(player.gamePieces).toEqual(8);
      });
    });

    describe('should not subtract game pieces', () => {
      test('when try to remove when player has two or less piece remaining', () => {
        const player = new Player('1', 'Any name', PositionStatus.BLACK, 3);

        player.remove();

        expect(() => player.remove()).toThrow(
          new LessThanThreeMenError('cannot remove piece'),
        );
      });
    });
  });
});
