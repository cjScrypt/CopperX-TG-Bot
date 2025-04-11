import { isEmail } from "class-validator";
import { ExtendedContext } from "../interfaces";
import { LocaleUtils, RegexUtils, TelegramUtils } from "../utils";
import { TransferView } from "../views";
import { BOT } from "../constants";

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
        const keyboard = TransferView.paymentPurposeKeyboard(ctx.i18n).reply_markup;
        await ctx.reply(prompt, {
            reply_markup: keyboard
        });

        return ctx.wizard.next();
    }

    static async handlePurposeCode(ctx: ExtendedContext, next: () => Promise<void>) {
        if (ctx.wizard.cursor !== 3) {
            console.error(`Unexpected Action`);
            return;
        }

        const data = TelegramUtils.getCallbackData(ctx);
        const purposeCode = data.match(
            RegexUtils.matchActionCode(BOT.ACTION.TRANSFER_EMAIL)
        );
        if (!purposeCode) {
            return;
        }

        ctx.wizard.state.emailTransfer.purposeCode = purposeCode[1];

        return next();
    }
}