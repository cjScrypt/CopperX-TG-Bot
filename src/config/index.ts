import * as dotenv from "dotenv";

dotenv.config();

export const REDIS_URL = process.env.REDIS_URL || "";

export const TG_TOKEN = process.env.TG_TOKEN || "";

export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN || "";