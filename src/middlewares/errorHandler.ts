import { NODE_ENV } from "../config";
import { CODE, GLOBAL } from "../constants";
import { store } from "../database/session";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils, SessionUtils } from "../utils";

export const errorHandler = async (error: any, ctx: ExtendedContext) => {
    if (error.message == CODE.ERROR.UNAUTHORIZED) {
        const key = SessionUtils.getSessionKey(ctx);
        ctx.session.copperX = { token: "" };
        await store.set(key, ctx.session);

        await ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession"));
        return;
    }
    if (NODE_ENV == GLOBAL.ENVIRONMENT.DEVELOPMENT) {
        throw error;
    }
    console.error(`Error (${Date}) - ${error}`);
}