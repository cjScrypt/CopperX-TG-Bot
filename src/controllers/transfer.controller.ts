import { ExtendedContext } from "../interfaces";
import { LocaleUtils } from "../utils";

export class TransferController {
    static async showTransferMenu(ctx: ExtendedContext, next: () => Promise<void>) {
        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.menu");
        await ctx.reply(prompt);
    }
}