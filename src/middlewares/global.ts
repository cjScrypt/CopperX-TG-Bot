import { Middleware, MiddlewareFn, session } from "telegraf";
import { i18n } from "../commons/locale";
import { store } from "../database/session";
import { ExtendedContext } from "../interfaces";
import { CopperXService, RedisService } from "../services";
import { LocaleUtils, RegexUtils, TelegramUtils } from "../utils";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();
    static addSessionToContext = session({ store });

    static async addCopperXTokenToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return;
        }

        const copperXService = new CopperXService();
        const authData = await copperXService.getAuthTokenByChatId(chatId);
        if (!authData) {
            return next();
        }

        ctx.copperXSession = {
            token: authData.token
        }

        return next();
    }

    static async addCopperXProfileToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const token = ctx.copperXSession.token;

        const copperXService = new CopperXService();
        const userProfile = await copperXService.fetchUserProfile(token);
        if (!userProfile) {
            return next();
        }

        // @todo Cache this data
        ctx.copperXSession = {
            user: userProfile,
            token: token
        }

        return next();
    }

    static exitSceneOnCommand(excludeCommand: string) {
        return async (ctx: ExtendedContext, next: () => Promise<void>) => {
            const command = TelegramUtils.getMessageText(ctx);

            if (ctx.scene && ctx.scene.current &&
                RegexUtils.isCommand(command) &&
                command !== excludeCommand
            ) {
                await ctx.scene.leave();
            }

            return next();
        }
    }

    static async cancelScene(ctx: ExtendedContext, next: () => Promise<void>) {
        await ctx.scene.leave();

        return next();
    }

    static async cleanupMessages(ctx: ExtendedContext, next: () => Promise<void>) {
        if (ctx.scene.current && ctx.session) {
            await ctx.deleteMessages([
                ctx.session.userMessageId,
                ctx.session.botMessageId
            ]);
        }
        return next();
    }

    static sceneSpecific(sceneid: string, middlewares: MiddlewareFn<ExtendedContext>[]) {
        return async (ctx: ExtendedContext, next: () => Promise<void>) => {
            if (ctx.scene.current && ctx.scene.current.id === sceneid) {
                for (const middleware of middlewares) {
                    await middleware(ctx, next);
                }
            }
        }
    }
}