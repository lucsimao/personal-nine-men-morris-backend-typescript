import { Logger, LoggerParams } from '../../../infra/protocols/Logger';
import { ElasticSearchService } from './ElasticSearchService';

export class ElasticSearchLoggerAdapter implements Logger {
  info(message: LoggerParams): void {
    this.logToElastic('info', message);
  }
  warning(message: LoggerParams): void {
    this.logToElastic('warning', message);
  }
  error(message: LoggerParams): void {
    this.logToElastic('error', message);
  }

  private logToElastic(type: string, body: { [key: string]: unknown }) {
    void ElasticSearchService.log({
      index: 'api',
      type: '_doc',
      body: { ...body, timestamp: new Date(), type },
    });
  }
}
