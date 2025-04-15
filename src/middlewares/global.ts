import { MiddlewareFn, session } from "telegraf";
import { ExtraEditMessageText } from "telegraf/typings/telegram-types";
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
                // @todo Delete this message when 'Cancel' button is pressed
                ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.commandInScene"));
                return;
            }

            return next();
        }
    }

    static async cleanupMessages(ctx: ExtendedContext, next: () => Promise<void>) {
        const lastBotMessage = ctx.session.botMessageId;
        ctx.session.botMessageId = 0;
        if (lastBotMessage) {
            await ctx.deleteMessage(lastBotMessage);
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

    static filterForeignCallbacks(excludeAction: string) {
        return async (ctx: ExtendedContext, next: () => Promise<void>) => {
            const lastBotMessage = ctx.session.__scenes?.history?.botMessageId || ctx.session.botMessageId;
            if (ctx.scene.current &&
                ctx.callbackQuery &&
                'data' in ctx.callbackQuery &&
                ctx.callbackQuery.data != excludeAction &&
                ctx.callbackQuery.message?.message_id != lastBotMessage
            ) {
                await ctx.answerCbQuery();
                return;
            }
            return next();
        }
    }

    static async clearPreviousStage(ctx: ExtendedContext, next: () => Promise<void>) {
        const prompt = ctx.session.__scenes?.history?.botMessageId;
        const response = ctx.message?.message_id;

        if (ctx.scene.current && prompt && response) {
            if (ctx.session.__scenes?.history?.botMessageId) {
                ctx.session.__scenes.history.botMessageId = 0;
            }
            await ctx.deleteMessages([prompt, response]);
        }

        return next();
    }

    static async authTokenInSession(ctx: ExtendedContext, next: () => Promise<void>) {
        const token = TelegramUtils.getAuthTokenFromSession(ctx.session);
        if (!token) {
            ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession"));
            return;
        }

        return next();
    }

    static async addEditMessageToContext(ctx: ExtendedContext, next: () => Promise<void>) {
        ctx.editMessage = async (text: string, extra?: ExtraEditMessageText) => {
            try {
                const messageId = ctx.session.botMessageId;
                if (!messageId) {
                    throw new Error("No botMessageId found in session");
                }

                return await ctx.telegram.editMessageText(
                    ctx.chat?.id,
                    messageId,
                    undefined,
                    text,
                    extra
                );
            } catch (error: any) {
                if (error.response.description.includes("message is not modified")) {
                    return true; // @note Possibly, delete existing message and reply with a new message for better user experience
                }

                throw error;
            }
        }

        return next();
    }
}