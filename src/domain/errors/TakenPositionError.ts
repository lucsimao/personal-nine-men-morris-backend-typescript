import { InvalidPositionError } from './InvalidPositionError';

export class TakenPositionError extends InvalidPositionError {
  constructor(position: number, message: string) {
    super(position, `${message} position is already taken`);
    this.name = 'TakenPositionError';
  }
}
