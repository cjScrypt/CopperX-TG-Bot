import { i18n } from "../commons/locale";
import { ExtendedContext } from "../interfaces";
import { CopperXService, RedisService } from "../services";
import { TelegramUtils } from "../utils";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();

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
}