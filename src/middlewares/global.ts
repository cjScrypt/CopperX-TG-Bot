import { i18n } from "../commons/locale";
import { ExtendedContext } from "../interfaces";
import { RedisService } from "../services/redis.service";
import { TelegramUtils } from "../utils";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();

    static async addCopperXSessionToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return;
        }

        const key = `${chatId}_copperx`;
        const session = await (new RedisService()).getValue(key);
        if (!session) {
            return next(); // Do nothing
        }

        ctx.copperXSession = session;

        return next();
    }
}