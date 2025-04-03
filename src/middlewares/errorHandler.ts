import { CODE } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils, SessionUtils } from "../utils";
import { store } from "../database/session";

export const errorHandler = async (error: any, ctx: ExtendedContext) => {
    if (error.message == CODE.ERROR.UNAUTHORIZED) {
        const key = SessionUtils.getSessionKey(ctx);
        ctx.session.copperX = { token: "" };
        await store.set(key, ctx.session);

        await ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession"));
        return;
    }
    throw error;
}