import { SceneSession } from "../interfaces";

export class SessionUtils {
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