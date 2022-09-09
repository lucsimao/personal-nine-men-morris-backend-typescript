export class EmptyHandError extends Error {
  constructor(message: string) {
    super(`player has no pieces in hand. ${message}`);
  }
}
