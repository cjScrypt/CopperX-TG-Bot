import { ExtendedContext } from "../interfaces";
import { LocaleUtils } from "../utils";
import { TransferView } from "../views";

export class TransferController {
    static async showTransferMenu(ctx: ExtendedContext, next: () => Promise<void>) {
        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.menu");
        const keyboard = TransferView.getTransferMenuKeyboard(ctx.i18n).reply_markup;
        await ctx.reply(prompt, {
            reply_markup: keyboard
        });
    }
}