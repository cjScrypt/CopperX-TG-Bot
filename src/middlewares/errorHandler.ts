import { NODE_ENV } from "../config";
import { CODE, GLOBAL } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils, SessionUtils } from "../utils";

export const errorHandler = async (error: any, ctx: ExtendedContext) => {
    if (error.message == CODE.ERROR.UNAUTHORIZED) {
        ctx.session.copperX = { token: "" };

        await SessionUtils.saveSession(ctx);

        await ctx.reply(
            LocaleUtils.getActionReplyText(ctx.i18n, "login.expiredSession")
        );
        return;
    }

    if (NODE_ENV == GLOBAL.ENVIRONMENT.DEVELOPMENT) {
        throw error;
    }
    console.error(`Error (${Date}) - ${error}`);
}