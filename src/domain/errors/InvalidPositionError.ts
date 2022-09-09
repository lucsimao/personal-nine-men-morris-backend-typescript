import { InvalidInteractionError } from './InvalidInteractionError';

export class InvalidPositionError extends InvalidInteractionError {
  constructor(position: number, message: string) {
    super(`position: ${position}. ${message}`);
    this.name = 'InvalidPositionError';
  }
}
