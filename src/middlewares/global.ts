import { Middleware, MiddlewareFn, session } from "telegraf";
import { i18n } from "../commons/locale";
import { store } from "../database/session";
import { ExtendedContext } from "../interfaces";
import { CopperXService, RedisService } from "../services";
import { LocaleUtils, RegexUtils, SessionUtils, TelegramUtils } from "../utils";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();
    static addSessionToContext = session({
        store,
        getSessionKey: (ctx: ExtendedContext) => {
            return SessionUtils.getSessionKey(ctx);
        }
    });

    static async initializeCopperXSession(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        ctx.session = ctx.session || {};
        if (!ctx.session.copperX) {
            ctx.session.copperX = { token: "" };
        }
        return next();
    }

    static async addCopperXProfileToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return;
        }
        const key = `profile_${chatId}`;
        const redisService = new RedisService();

        let data = await redisService.getValue(key);
        if (data) {
            ctx.session.copperX.user = data;
            return next();
        }

        const token = ctx.session.copperX.token;
        if (!token) {
            return next();
        }
        const userProfile = await (new CopperXService()).fetchUserProfile(token);
        if (!userProfile) {
            // @todo Remove auth token from session
            return next();
        }

        await redisService.setValue(key, userProfile, 60 * 60);
        ctx.session.copperX.user = userProfile;

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

    static preventCommandsInScene(excludeCommand: string) {
        return async (ctx: ExtendedContext, next: () => Promise<void>) => {
            const command = TelegramUtils.getMessageText(ctx);

            if (ctx.scene.current &&
                RegexUtils.isCommand(command) &&
                command !== excludeCommand
            ) {
                ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.commandInScene"));
                return;
            }

            return next();
        }
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

    static async isCbMessageOrigin(ctx: ExtendedContext, next: () => Promise<void>) {
        if (ctx.callbackQuery &&
            ctx.callbackQuery.message?.message_id != ctx.session.botMessageId
        ) {
            await ctx.answerCbQuery();
            return;
        }
        return next();
    }
}