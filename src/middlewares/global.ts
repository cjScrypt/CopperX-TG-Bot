import { i18n } from "../commons/locale";
import { ExtendedContext } from "../interfaces";
import { CopperXService, RedisService } from "../services";
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

        const copperXService = new CopperXService();
        const authData = await copperXService.getAuthTokenByChatId(chatId);
        if (!authData) {
            return next();
        }

        const userProfile = await copperXService.fetchUserProfile(authData.token);
        if (!userProfile) {
            return next();
        }

        ctx.copperXSession = {
            user: userProfile,
            token: authData.token
        }

        return next();
    }
}