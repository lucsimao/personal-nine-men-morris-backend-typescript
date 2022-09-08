import { InvalidPositionError } from './InvalidPositionError';

export class OutOfRangeError extends InvalidPositionError {
  constructor(position: number, message: string) {
    super(position, `${message} - position must be between 1 and 24`);
    this.name = 'OutOfRangeError';
  }
}
