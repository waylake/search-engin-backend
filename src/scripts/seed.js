"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearchService_1 = require("../src/services/elasticsearchService");
const redisService_1 = require("../src/services/redisService");
const esService = new elasticsearchService_1.ElasticsearchService();
const redisService = new redisService_1.RedisService();
function seedElasticsearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const documents = [
            { id: "1", content: "Learn Elasticsearch" },
            { id: "2", content: "Learn Redis" },
            { id: "3", content: "Learn TypeScript" },
        ];
        for (const doc of documents) {
            yield esService.indexDocument("your-index", doc.id, doc);
        }
    });
}
function seedRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        const suggestions = [
            "Elasticsearch",
            "Redis",
            "TypeScript",
            "JavaScript",
            "Node.js",
        ];
        for (const suggestion of suggestions) {
            yield redisService.addAutocompleteSuggestion(suggestion);
        }
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield seedElasticsearch();
        yield seedRedis();
    });
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
