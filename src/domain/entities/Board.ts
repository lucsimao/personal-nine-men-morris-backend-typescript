import { PositionStatus } from '../enum/PositionStatus';
import { BoardPosition } from '../interfaces/BoardPosition';

export const getDefaultPositions = () => [
  ...[
    { id: 1, adjacentPositionId: [2, 4], status: PositionStatus.VOID },
    { id: 2, adjacentPositionId: [1, 3, 12], status: PositionStatus.VOID },
    { id: 3, adjacentPositionId: [2, 5], status: PositionStatus.VOID },
    { id: 4, adjacentPositionId: [1, 6, 9], status: PositionStatus.VOID },
    { id: 5, adjacentPositionId: [3, 8, 14], status: PositionStatus.VOID },
    { id: 6, adjacentPositionId: [4, 7], status: PositionStatus.VOID },
    { id: 7, adjacentPositionId: [6, 8, 16], status: PositionStatus.VOID },
    { id: 8, adjacentPositionId: [5, 7], status: PositionStatus.VOID },
    { id: 9, adjacentPositionId: [4, 10, 11, 18], status: PositionStatus.VOID },
    { id: 10, adjacentPositionId: [9, 16], status: PositionStatus.VOID },
    { id: 11, adjacentPositionId: [9, 12], status: PositionStatus.VOID },
    {
      id: 12,
      adjacentPositionId: [2, 11, 13, 24],
      status: PositionStatus.VOID,
    },
    { id: 13, adjacentPositionId: [12, 14], status: PositionStatus.VOID },
    {
      id: 14,
      adjacentPositionId: [5, 13, 15, 23],
      status: PositionStatus.VOID,
    },
    { id: 15, adjacentPositionId: [14, 16], status: PositionStatus.VOID },
    {
      id: 16,
      adjacentPositionId: [7, 10, 15, 20],
      status: PositionStatus.VOID,
    },
    { id: 17, adjacentPositionId: [18, 24], status: PositionStatus.VOID },
    { id: 18, adjacentPositionId: [9, 17, 19], status: PositionStatus.VOID },
    { id: 19, adjacentPositionId: [18, 20], status: PositionStatus.VOID },
    { id: 20, adjacentPositionId: [16, 19, 21], status: PositionStatus.VOID },
    { id: 21, adjacentPositionId: [20, 23], status: PositionStatus.VOID },
    { id: 22, adjacentPositionId: [23, 24], status: PositionStatus.VOID },
    { id: 23, adjacentPositionId: [14, 21, 22], status: PositionStatus.VOID },
    { id: 24, adjacentPositionId: [12, 17, 22], status: PositionStatus.VOID },
  ],
];

export class Board {
  private readonly positions: BoardPosition[];

  constructor() {
    this.positions = getDefaultPositions();
  }
}
