// import { ElasticSearchLoggerAdapter } from '../adapters/logger/elastic-search/ElasticSearchLoggerAdapter';
import { ElasticSearchLoggerAdapter } from '../adapters/logger/elastic-search/ElasticSearchLoggerAdapter';
import { PinoAdapter } from '../adapters/LoggerAdapter';
import { LoggerDecorator } from '../decorator/LoggerDecorator';

export const makeLogger = () => {
  const result = new LoggerDecorator([
    new PinoAdapter(),
    new ElasticSearchLoggerAdapter(),
  ]);

  return result;
};
