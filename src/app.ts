import { Express } from "express";

import { setupBot } from "./bot";
import { WEBHOOK_DOMAIN } from "./config";


export const configureApp = async (app: Express) => {
    const bot = setupBot();

    app.use(await bot.createWebhook({
        domain: WEBHOOK_DOMAIN,
        drop_pending_updates: true // @todo remove 'drop_pending updates' option
    }));
}
