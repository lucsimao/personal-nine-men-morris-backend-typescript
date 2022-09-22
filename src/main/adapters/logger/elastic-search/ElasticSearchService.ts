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
      // eslint-disable-next-line no-console
      console.error('cannot log to elastic search: ', params.body.msg);
    }
  }
}
