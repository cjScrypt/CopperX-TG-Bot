import { session } from "telegraf";
import { i18n } from "../commons/locale";
import { store } from "../database/session";
import { ExtendedContext } from "../interfaces";
import { CopperXService, RedisService } from "../services";
import { TelegramUtils } from "../utils";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();
    static addSessionToContext = session({ store });

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

    static async addCopperXProfileToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const token = ctx.copperXSession.token;

        const copperXService = new CopperXService();
        const userProfile = await copperXService.fetchUserProfile(token);
        if (!userProfile) {
            return next();
        }

        // @todo Cache this data
        ctx.copperXSession = {
            user: userProfile,
            token: token
        }

        return next();
    }
}