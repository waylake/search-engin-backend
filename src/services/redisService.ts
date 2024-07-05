import Redis from "ioredis";

export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "redis",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    });
  }

  public async getCache(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  public async setCache(
    key: string,
    value: string,
    ttl: number = 10,
  ): Promise<void> {
    await this.redis.set(key, value, "EX", ttl);
  }

  public async delCache(key: string): Promise<void> {
    await this.redis.del(key);
  }

  public async getAutocompleteSuggestions(query: string): Promise<string[]> {
    const suggestions = await this.redis.zrangebylex(
      "autocomplete",
      `[${query}`,
      `[${query}\xff`,
      "LIMIT",
      0,
      10,
    );
    return suggestions;
  }

  public async addAutocompleteSuggestion(suggestion: string): Promise<void> {
    await this.redis.zadd("autocomplete", 0, suggestion);
  }
}
