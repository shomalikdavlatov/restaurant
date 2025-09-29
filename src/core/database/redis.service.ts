import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.client = new Redis(this.configService.get("REDIS_URL")!);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async incr(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    async expire(key: string, seconds: number): Promise<void> {
        await this.client.expire(key, seconds);
    }
}
