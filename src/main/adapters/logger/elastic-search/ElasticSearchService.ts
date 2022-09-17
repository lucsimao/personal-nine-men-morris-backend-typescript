import elasticsearch, { Client } from '@elastic/elasticsearch';

import { Env } from '../../../../config/Env';

const elasticSearchEnv = Env.logger.elasticSearch;
export interface ITransportParams {
  readonly index: string;
  readonly type: string;
  readonly body: { timestamp: Date; [key: string]: unknown };
}

export default class ElasticSearchService {
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
    const client = await this.getClient();
    await client.index(params);
  }
}
