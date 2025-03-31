import { Agent } from "https";
import { Telegraf } from "telegraf";

import { TG_TOKEN } from "./config";
import { ExtendedContext } from "./interfaces";
import {
    CommonController,
    HelpController,
    StartController
} from "./controllers";
import { BOT } from "./constants";
import { GlobalMiddleware, UserMiddleware } from "./middlewares";
import { mainStage } from "./scenes";

export const setupBot = () => {
    const agent = new Agent({
        keepAlive: true,
        timeout: 20000, // Timeout in milliseconds
    });
    const bot = new Telegraf<ExtendedContext>(TG_TOKEN, {
        telegram: { agent }
    });

    bot.use(GlobalMiddleware.addI18nToContext);
    bot.use(GlobalMiddleware.addSessionToContext);
    bot.use(UserMiddleware.addUserToContext);
    bot.use(GlobalMiddleware.cleanupMessage);

    bot.start(
        StartController.showStart
    );

    bot.command(BOT.COMMAND.HELP, HelpController.showHelp);

    bot.command(BOT.COMMAND.LOGIN, CommonController.enterScene(BOT.SCENE.LOGIN));

    bot.use(mainStage.middleware());

    return bot;
}