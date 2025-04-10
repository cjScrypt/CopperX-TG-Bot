import { ExtendedContext } from "../interfaces";
import { LocaleUtils } from "../utils";
import { TransferView } from "../views";

export class EmailTransferController {
    static async promptEmail(ctx: ExtendedContext) {
        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterEmail");
        const keyboard = TransferView.getCancelKeyboard(ctx.i18n).reply_markup;
        await ctx.reply(prompt, {
            reply_markup: keyboard
        });

        return ctx.wizard.next();
    }
}