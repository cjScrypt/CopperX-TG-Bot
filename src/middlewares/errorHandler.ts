import { CODE } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils } from "../utils";

export const errorHandler = async (error: any, ctx: ExtendedContext) => {
    if (error.message == CODE.ERROR.UNAUTHORIZED) {
        ctx.session.copperX = { token: "" };
        await ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession"));
    }
}