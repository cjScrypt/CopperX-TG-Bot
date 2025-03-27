import { SceneSession } from "../interfaces";

export class SessionUtils {
    static setLastMessageId(session: SceneSession, messageId?: number) {
        if (!messageId) {
            return;
        }
        session.lastMessageId = messageId;
    }
}