import { ElasticsearchService } from "../services/elasticsearchService";
import { RedisService } from "../services/redisService";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const redisService = new RedisService();
const esService = new ElasticsearchService(redisService);

async function seedElasticsearch() {
  const documents = [
    { id: "1", content: "Learn Elasticsearch" },
    { id: "2", content: "Learn Redis" },
    { id: "3", content: "Learn TypeScript" },
    { id: "3", content: "TypeScript" },
  ];

  for (const doc of documents) {
    await esService.indexDocument("test-index", doc.id, doc);
  }
}

async function seedRedis() {
  const suggestions = [
    "Elasticsearch",
    "Redis",
    "TypeScript",
    "JavaScript",
    "Node.js",
  ];

  for (const suggestion of suggestions) {
    await redisService.addAutocompleteSuggestion(suggestion);
  }
}

async function seed() {
  await sleep(10000);

  await seedElasticsearch();
  await seedRedis();
}

seed()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
  });
