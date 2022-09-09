export class LessThanThreeMenError extends Error {
  constructor(message: string) {
    super(`player has less than three men left. ${message}`);
  }
}
