import { ExtendedContext, SceneSession } from "../interfaces";
import { TelegramUtils } from "./telegram.utils";

export class SessionUtils {
    static getSessionKey(ctx: ExtendedContext) {
        const chatId = TelegramUtils.getChatId(ctx);

        return `user_${chatId}`;
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
}