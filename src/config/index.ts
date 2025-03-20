import * as dotenv from "dotenv";

dotenv.config();

export const TG_TOKEN = process.env.TG_TOKEN || "";

export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN || "";