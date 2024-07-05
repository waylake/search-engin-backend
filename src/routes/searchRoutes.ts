import express from "express";
import { SearchController } from "../controllers/searchController";
import { ElasticsearchService } from "../services/elasticsearchService";
import { RedisService } from "../services/redisService";

const router = express.Router();

const redisService = new RedisService();
const elasticsearchService = new ElasticsearchService(redisService);
const searchController = new SearchController(
  elasticsearchService,
  redisService,
);

router.get("/", searchController.search.bind(searchController));
router.get(
  "/autocomplete",
  searchController.autocomplete.bind(searchController),
);

export default router;
