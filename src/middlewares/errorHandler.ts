import { CODE } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils } from "../utils";

export const errorHandler = async (ctx: ExtendedContext, next: () => Promise<void>) => {
    try {
        await next();
    } catch(error: any) {
        if (error.message == CODE.ERROR.UNAUTHORIZED) {
            ctx.session.copperX = { token: "" };
            await ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession"));
        }
        return next();
    }
}