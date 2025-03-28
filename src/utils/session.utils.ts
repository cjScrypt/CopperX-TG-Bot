import { SceneSession } from "../interfaces";

export class SessionUtils {
    static setUserLastMessageId(session: SceneSession, messageId?: number) {
        if (!messageId) {
            return;
        }
        session.userLastMessageId = messageId;
    }
}