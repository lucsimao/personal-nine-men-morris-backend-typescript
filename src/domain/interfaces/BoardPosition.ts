import { PositionStatus } from '../enum/PositionStatus';

export interface BoardPosition {
  id: number;
  adjacentPositionId: number[];
  status: PositionStatus;
}
