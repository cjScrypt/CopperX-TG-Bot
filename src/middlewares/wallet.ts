import { ExtendedContext } from "../interfaces";
import { LocaleUtils, TelegramUtils } from "../utils";

export class WalletMiddleware {
    static expectWalletName(ctx: ExtendedContext, next: () => Promise<void>) {
        const isExpectInput = ctx.session.expectInput === true;
        const messageText = TelegramUtils.getMessageText(ctx);

        if (isExpectInput && !messageText) {
            LocaleUtils.getWalletText(ctx.i18n, "editName.expectName");
            return;
        }

        return next();
    }
}