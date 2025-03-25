import * as dotenv from "dotenv";

dotenv.config();

export const REDIS_URL = process.env.REDIS_URL || "";

export const TG_TOKEN = process.env.TG_TOKEN || "";

export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN || "";

// Session Config
export const SESSION_DB_HOST = process.env.SESSION_DB_HOST || "";
export const SESSION_DB_NAME = process.env.SESSION_NAME || "";
export const SESSION_DB_USER = process.env.SESSION_DB_USER || "";
export const SESSION_DB_PASSWORD = process.env.SESSION_DB_PASSWORD || "";