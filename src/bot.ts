import { Agent } from "https";
import { Telegraf } from "telegraf";

import { TG_TOKEN } from "./config";
import { ExtendedContext } from "./interfaces";
import { HelpController } from "./controllers";
import { BOT } from "./constants";
import { GlobalMiddleware, UserMiddleware } from "./middlewares";

export const setupBot = () => {
    const agent = new Agent({
        keepAlive: true,
        timeout: 20000, // Timeout in milliseconds
    });
    const bot = new Telegraf<ExtendedContext>(TG_TOKEN, {
        telegram: { agent }
    });

    bot.use(GlobalMiddleware.addI18nToContext);
    bot.use(UserMiddleware.addUserToContext);
    bot.use(GlobalMiddleware.addCopperXSessionToContext);

    bot.command(BOT.COMMAND.HELP, HelpController.showHelp);

    return bot;
}