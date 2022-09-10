import { PositionStatus } from '../enum/PositionStatus';
import { InvalidStartPiecesError } from '../errors';
import { EmptyHandError } from '../errors/EmptyHandError';
import { LessThanThreeMenError } from '../errors/LessThanThreeMenError';

export class Player {
  private _piecesInHand;
  private _gamePieces;

  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _color: PositionStatus,
    startPieces = 9,
  ) {
    if (startPieces < 3) {
      throw new InvalidStartPiecesError(startPieces);
    }
    this._piecesInHand = startPieces;
    this._gamePieces = startPieces;
  }

  add() {
    if (this._piecesInHand <= 0) {
      throw new EmptyHandError('cannot add piece');
    }
    this._piecesInHand--;
  }

  remove() {
    if (this._gamePieces <= 2) {
      throw new LessThanThreeMenError('cannot remove piece');
    }
    this._gamePieces--;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get color() {
    return this._color;
  }

  get piecesInHand() {
    return this._piecesInHand;
  }

  get gamePieces() {
    return this._gamePieces;
  }
}
