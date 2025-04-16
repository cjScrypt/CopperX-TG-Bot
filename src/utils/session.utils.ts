import { TelegramUtils } from "./telegram.utils";
import { store } from "../database/session";
import { ExtendedContext, SceneSession } from "../interfaces";

export class SessionUtils {
    static getSessionKey(ctx: ExtendedContext) {
        const chatId = TelegramUtils.getChatId(ctx);

        return `user_${chatId}`;
    }

    static async saveSession(ctx: ExtendedContext) {
        const key = SessionUtils.getSessionKey(ctx);
        await store.set(key, ctx.session);
    }

    static setUserLastMessageId(session: SceneSession, messageId?: number) {
        if (!messageId) {
            return;
        }
        session.userMessageId = messageId;
    }

    static setBotLastMessageId(session: SceneSession, messageId?: number) {
        if (!messageId) {
            return;
        }
        session.botMessageId = messageId;
    }

    static saveHistory(
        session: SceneSession,
        botMessageId?: number
    ) {
        if (!botMessageId) {
            return;
        }
        if (session.__scenes) {
            session.__scenes.history = { botMessageId }
        }
    }
}