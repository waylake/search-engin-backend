import { Client } from "@elastic/elasticsearch";
import { RedisService } from "./redisService";

export class ElasticsearchService {
  private client: Client;
  private redisService: RedisService;

  constructor(redisService: RedisService) {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || "http://elasticsearch:9200",
    });
    this.redisService = redisService;
  }

  public async search(query: string): Promise<any[]> {
    if (query.length < 2) {
      throw new Error("Search query must be at least 2 characters long.");
    }

    const { body } = await this.client.search({
      index: "test-index",
      body: {
        query: {
          match_phrase_prefix: { content: query },
        },
      },
    });

    return body.hits.hits;
  }

  public async indexDocument(
    index: string,
    id: string,
    document: object,
  ): Promise<void> {
    await this.client.index({
      index,
      id,
      body: document,
    });
    await this.client.indices.refresh({ index });

    await this.redisService.delCache(index);
  }
}
