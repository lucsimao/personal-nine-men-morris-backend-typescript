import elasticsearch, { Client } from '@elastic/elasticsearch';

import { Env } from '../../../../config/Env';

const elasticSearchEnv = Env.logger.elasticSearch;
interface ITransportParams {
  readonly index: string;
  readonly type: string;
  readonly body: { timestamp: Date; [key: string]: unknown };
}

export class ElasticSearchService {
  private static client: Client;

  public static async getClient(): Promise<Client> {
    this.client = this.client
      ? this.client
      : new elasticsearch.Client({
          node: `${elasticSearchEnv.url}:${elasticSearchEnv.port}`,
        });
    return this.client;
  }

  public static async log(params: ITransportParams): Promise<void> {
    try {
      const client = await this.getClient();
      await client.index(params);
    } catch (error) {
      await this.log({
        index: 'api',
        type: '_doc',
        body: {
          timestamp: new Date(),
          type: 'error',
          msg: (error as Error).message,
        },
      });
    }
  }
}
