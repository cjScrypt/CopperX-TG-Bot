import { isEmail } from "class-validator";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils, TelegramUtils } from "../utils";
import { TransferView } from "../views";

export class EmailTransferController {
    static async promptEmail(ctx: ExtendedContext) {
        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterEmail");
        await ctx.reply(prompt, {
            reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
        });

        ctx.wizard.state.emailTransfer = {}

        return ctx.wizard.next();
    }

    static async promptPayeeId(ctx: ExtendedContext) {
        const email = TelegramUtils.getMessageText(ctx);
        if (!email || !isEmail(email)) {
            await ctx.reply(
                LocaleUtils.getTransferText(ctx.i18n, "error.invalidEmail"),
                {
                    reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
        }

        ctx.wizard.state.emailTransfer.email = email;

        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterPayeeId");
        await ctx.reply(prompt, {
            reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
        });

        return ctx.wizard.next();
    }

    static async promptPurposeCode(ctx: ExtendedContext) {
        const payeeId = TelegramUtils.getMessageText(ctx);
        if (!payeeId) {
            await ctx.reply(
                LocaleUtils.getTransferText(ctx.i18n, "prompt.enterPayeeId"),
                {
                    reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
        }

        ctx.wizard.state.emailTransfer.payeeId = payeeId;

        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterPurposeCode");
        await ctx.reply(prompt, {
            reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
        });

        return ctx.wizard.next();
    }
}