export class InvalidStartPiecesError extends Error {
  constructor(startPieces: number) {
    super(
      `start pieces: ${startPieces} - start pieces must be greater than or equal to 3`,
    );
  }
}
