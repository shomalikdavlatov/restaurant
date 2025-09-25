"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    configService;
    client;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.client = new ioredis_1.default(this.configService.get("REDIS_URL"));
    }
    async onModuleDestroy() {
        await this.client.quit();
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return await this.client.get(key);
    }
    async del(key) {
        await this.client.del(key);
    }
    async incr(key) {
        return await this.client.incr(key);
    }
    async expire(key, seconds) {
        await this.client.expire(key, seconds);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map