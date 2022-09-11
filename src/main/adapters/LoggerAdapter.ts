import pino from 'pino';

import { Logger, LoggerParams } from '../infra/protocols/Logger';

export class PinoAdapter implements Logger {
  private static logger?: Logger;
  private readonly pino;

  private constructor() {
    this.pino = pino();
  }

  public info(params: LoggerParams): void {
    this.pino.info(params);
  }

  public error(params: LoggerParams): void {
    this.pino.error(params);
  }

  public warning(params: LoggerParams): void {
    this.pino.warn(params);
  }

  public static getInstance(): Logger {
    if (!this.logger) {
      this.logger = new PinoAdapter();
    }
    return this.logger;
  }
}
