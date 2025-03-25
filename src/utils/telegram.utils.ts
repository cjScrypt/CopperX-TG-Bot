import { ExtendedContext, SceneSession } from "../interfaces";

export class TelegramUtils {
    static getUserFromContext(ctx: ExtendedContext) {
        const user = ctx.callbackQuery?.from || ctx.from;
        if (!user) {
            const errorId = `${this.getChatId(ctx)}:${ctx.message?.message_id}`;
            console.error(`${errorId} - Current Context is missing the message originator property.`);
        }

        return user;
    }

    static getChatId(ctx: ExtendedContext) {
        return ctx.chat?.id;
    }

    static getMessageText(ctx: ExtendedContext) {
        if (ctx.message && 'text' in ctx.message) {
            return ctx.message.text.trim();
        }

        return '';
    }

    static getAuthTokenFromSession(session: SceneSession) {
        if (!session.copperX) {
            return null;
        }

        return session.copperX.token;
    }
}