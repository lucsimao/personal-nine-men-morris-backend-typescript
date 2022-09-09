import { InvalidPositionError } from './InvalidPositionError';

export class EmptyPositionError extends InvalidPositionError {
  constructor(position: number, message: string) {
    super(position, `${message} - position is empty`);
    this.name = 'EmptyPositionError';
  }
}
