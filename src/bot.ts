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
import { GlobalMiddleware, UserMiddleware, errorHandler } from "./middlewares";
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
    bot.use(GlobalMiddleware.initializeCopperXSession);

    bot.use(mainStage.middleware());

    bot.start(StartController.showStart);

    bot.command(BOT.COMMAND.HELP, HelpController.showHelp);
    bot.action(BOT.ACTION.HELP, HelpController.showHelp);

    bot.command(
        BOT.COMMAND.LOGIN,
        CommonController.enterScene(BOT.SCENE.LOGIN)
    );
    bot.action(
        BOT.ACTION.LOGIN,
        CommonController.enterScene(BOT.SCENE.LOGIN)
    );

    bot.command(
        BOT.COMMAND.PROFILE,
        CommonController.enterScene(BOT.SCENE.PROFILE)
    );
    bot.action(
        BOT.ACTION.PROFILE,
        CommonController.enterScene(BOT.SCENE.PROFILE)
    );

    bot.action(
        BOT.ACTION.WALLET_MANAGEMENT,
        CommonController.enterScene(BOT.SCENE.WALLET_MANAGEMENT)
    );

    bot.catch(errorHandler);

    return bot;
}