import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../config";

export const client: RedisClientType = createClient({
    url: REDIS_URL
});

client.connect();