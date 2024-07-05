import { Request, Response } from "express";
import { ElasticsearchService } from "../services/elasticsearchService";
import { RedisService } from "../services/redisService";
import { searchSchema, autocompleteSchema } from "../schemas/searchSchemas";

export class SearchController {
  constructor(
    private elasticsearchService: ElasticsearchService,
    private redisService: RedisService,
  ) {}

  private formatSearchTime(startTime: number, endTime: number): string {
    const duration = endTime - startTime;
    return `${duration}ms`;
  }

  public async search(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    const validation = searchSchema.safeParse({ q: query });
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const startTime = Date.now();

    try {
      // Check cache first
      const cacheResult = await this.redisService.getCache(query);
      if (cacheResult) {
        const endTime = Date.now();
        const searchTime = this.formatSearchTime(startTime, endTime);
        res.json({ results: JSON.parse(cacheResult), searchTime, cache: true });
        return;
      }

      // If no cache, search in Elasticsearch
      const results = await this.elasticsearchService.search(validation.data.q);
      const endTime = Date.now();
      const searchTime = this.formatSearchTime(startTime, endTime);

      // Set cache
      await this.redisService.setCache(query, JSON.stringify(results));

      res.json({ results, searchTime, cache: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      res.status(500).json({ error: errorMessage });
    }
  }

  public async autocomplete(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    const validation = autocompleteSchema.safeParse({ q: query });
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const startTime = Date.now();

    try {
      const suggestions = await this.redisService.getAutocompleteSuggestions(
        validation.data.q,
      );
      const endTime = Date.now();
      const searchTime = this.formatSearchTime(startTime, endTime);

      res.json({ suggestions, searchTime });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      res.status(500).json({ error: errorMessage });
    }
  }
}
