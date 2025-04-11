import { isEmail } from "class-validator";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { WalletService } from "../services";
import { LocaleUtils, RegexUtils, TelegramUtils } from "../utils";
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

    static async promptCurrencyCode(ctx: ExtendedContext) {
        const walletService = new WalletService();
        const token = ctx.session.copperX.token;

        const defaultWallet = await walletService.getDefaultWallet(token);
        const wallet = await walletService.getWalletById(defaultWallet.id, token);
        if (!wallet) {
            console.error(`Wallet with ID ${defaultWallet.id} not found`);
            return;
        }

        const keyboard = TransferView.currencyKeyboard(wallet).reply_markup;
        await ctx.reply(
            LocaleUtils.getTransferText(ctx.i18n, "prompt.enterCurrencyCode"),
            {
                reply_markup: keyboard
            }
        );

        return ctx.wizard.next();
    }
}