import { PositionStatus } from '../enum/PositionStatus';
import { OutOfRangeError, TakenPositionError } from '../errors';
import { Board, getDefaultPositions } from './Board';

const makeSut = () => {
  const sut = new Board();

  return { sut };
};

describe('Board', () => {
  describe('Should populate positions', () => {
    test('when instantiated with success', () => {
      const { sut } = makeSut();

      const result = sut.getPositions();

      expect(result).not.toBe(getDefaultPositions());
      expect(result).toEqual(getDefaultPositions());
    });
  });

  describe('when add piece', () => {
    describe('should change piece status', () => {
      test('when receive a valid piece', () => {
        const { sut } = makeSut();

        sut.add(1, PositionStatus.WHITE);
        sut.add(10, PositionStatus.BLACK);
        sut.add(24, PositionStatus.WHITE);

        expect(sut.getStatusInPosition(1)).toBe(PositionStatus.WHITE);
        expect(sut.getStatusInPosition(10)).toBe(PositionStatus.BLACK);
        expect(sut.getStatusInPosition(24)).toBe(PositionStatus.WHITE);
      });
    });

    describe('should not change piece status', () => {
      test('when target position is filled', () => {
        const { sut } = makeSut();
        sut.add(6, PositionStatus.BLACK);

        expect(() => {
          sut.add(6, PositionStatus.WHITE);
        }).toThrow(new TakenPositionError(6, 'cannot add piece'));
      });

      test('when target is out of board range', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.add(0, PositionStatus.BLACK);
        }).toThrow(new OutOfRangeError(0, 'cannot add piece'));
        expect(() => {
          sut.add(25, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(25, 'cannot add piece'));
      });
    });
  });
});
