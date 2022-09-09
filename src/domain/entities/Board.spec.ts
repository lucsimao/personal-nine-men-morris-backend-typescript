import { PositionStatus } from '../enum/PositionStatus';
import {
  EmptyPositionError,
  InvalidPositionError,
  OutOfRangeError,
  TakenPositionError,
} from '../errors';
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

  describe('when remove piece', () => {
    describe('should change position status to void', () => {
      test('when position has a valid piece', () => {
        const { sut } = makeSut();
        sut.add(1, PositionStatus.WHITE);
        sut.add(10, PositionStatus.BLACK);
        sut.add(24, PositionStatus.WHITE);

        sut.remove(1, PositionStatus.BLACK);
        sut.remove(10, PositionStatus.WHITE);
        sut.remove(24, PositionStatus.BLACK);

        expect(sut.getStatusInPosition(1)).toBe(PositionStatus.VOID);
        expect(sut.getStatusInPosition(10)).toBe(PositionStatus.VOID);
        expect(sut.getStatusInPosition(24)).toBe(PositionStatus.VOID);
      });
    });

    describe('should not change position status', () => {
      test('when piece status is equal to player status', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.WHITE);

        expect(() => {
          sut.remove(10, PositionStatus.WHITE);
        }).toThrow(
          new InvalidPositionError(
            10,
            'cannot remove piece with same player status',
          ),
        );
      });

      test('when position is empty', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.remove(10, PositionStatus.WHITE);
        }).toThrow(new EmptyPositionError(10, 'cannot remove piece'));
      });

      test('when position is out of board range', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.remove(0, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(0, 'cannot remove piece'));
        expect(() => {
          sut.remove(25, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(25, 'cannot remove piece'));
      });
    });
  });

  describe('when move piece', () => {
    describe('should remove the origin position and add target position', () => {
      test('when receive valid origin and target position', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);

        sut.move(10, 9, PositionStatus.BLACK);

        expect(sut.getStatusInPosition(10)).toBe(PositionStatus.VOID);
        expect(sut.getStatusInPosition(9)).toBe(PositionStatus.BLACK);
      });
    });

    describe('should not move piece', () => {
      test('when origin piece status is different from player status', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);

        expect(() => {
          sut.move(10, 12, PositionStatus.WHITE);
        }).toThrow(
          new InvalidPositionError(
            12,
            'cannot move piece with status different from player status',
          ),
        );
      });

      test('when target position is not adjacent to origin position', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);

        expect(() => {
          sut.move(10, 12, PositionStatus.BLACK);
        }).toThrow(
          new InvalidPositionError(
            12,
            'cannot move piece to a non adjacent position',
          ),
        );
      });

      test('when origin position is empty', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.move(10, 9, PositionStatus.WHITE);
        }).toThrow(new EmptyPositionError(10, 'cannot move piece'));
      });

      test('quando a posição final estiver ocupada', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);
        sut.add(9, PositionStatus.BLACK);

        expect(() => {
          sut.move(10, 9, PositionStatus.BLACK);
        }).toThrow(new EmptyPositionError(9, 'cannot move piece'));
      });

      test('when origin position is out of board range', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.move(0, 9, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(0, 'cannot move piece'));
        expect(() => {
          sut.move(25, 9, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(25, 'cannot move piece'));
      });

      test('when targe position is out of board range', () => {
        const { sut } = makeSut();

        expect(() => {
          sut.move(10, 0, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(0, 'cannot move piece'));
        expect(() => {
          sut.move(10, 25, PositionStatus.WHITE);
        }).toThrow(new OutOfRangeError(25, 'cannot move piece'));
      });
    });
  });

  describe('when verifying mills', () => {
    describe('show return mills', () => {
      test('when there is a horizontal line with three pieces of the same color', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);
        sut.add(16, PositionStatus.BLACK);
        sut.add(15, PositionStatus.BLACK);

        expect(sut.hasMill(10)).toBe(true);
        expect(sut.hasMill(16)).toBe(true);
        expect(sut.hasMill(15)).toBe(true);
      });

      test('when there is a vertical line with three pieces of the same color', () => {
        const { sut } = makeSut();
        sut.add(3, PositionStatus.BLACK);
        sut.add(5, PositionStatus.BLACK);
        sut.add(8, PositionStatus.BLACK);

        expect(sut.hasMill(3)).toBe(true);
        expect(sut.hasMill(5)).toBe(true);
        expect(sut.hasMill(8)).toBe(true);
      });
    });

    describe('should not return mills', () => {
      test('when target piece is vacant', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);
        sut.add(16, PositionStatus.BLACK);

        expect(() => sut.hasMill(15)).toThrow(
          new EmptyPositionError(15, 'cannot verify mill'),
        );
      });

      test('when there is only two pieces with same color', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);
        sut.add(16, PositionStatus.BLACK);

        expect(sut.hasMill(10)).toBe(false);
        expect(sut.hasMill(16)).toBe(false);
      });
      test('when there is a line with piece with different colors', () => {
        const { sut } = makeSut();
        sut.add(10, PositionStatus.BLACK);
        sut.add(16, PositionStatus.BLACK);
        sut.add(15, PositionStatus.WHITE);

        expect(sut.hasMill(10)).toBe(false);
        expect(sut.hasMill(16)).toBe(false);
        expect(sut.hasMill(15)).toBe(false);
      });
    });
  });
});
