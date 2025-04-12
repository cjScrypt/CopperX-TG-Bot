import { isEmail, isNumber } from "class-validator";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { TransferService, WalletService } from "../services";
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
            return;
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
            return;
        }

        ctx.wizard.state.emailTransfer.payeeId = payeeId;

        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterPurposeCode");
        const keyboard = TransferView.paymentPurposeKeyboard(ctx.i18n).reply_markup;
        await ctx.reply(prompt, {
            reply_markup: keyboard
        });

        return ctx.wizard.next();
    }

    static async promptCurrencyCode(ctx: ExtendedContext) {
        const data = TelegramUtils.getCallbackData(ctx);
        const purposeCode = data.match(
            RegexUtils.matchActionCode(BOT.ACTION.TRANSFER_EMAIL)
        );
        if (!purposeCode) {
            return;
        }

        ctx.wizard.state.emailTransfer.purposeCode = purposeCode[1];

        const walletService = new WalletService();
        const token = ctx.session.copperX.token;

        const defaultWallet = await walletService.getDefaultWallet(token);
        const wallet = await walletService.getWalletById(defaultWallet.id, token);
        if (!wallet) {
            console.error(`Wallet with ID ${defaultWallet.id} not found`);
            return;
        }

        await ctx.reply(
            LocaleUtils.getTransferText(ctx.i18n, "prompt.enterCurrencyCode"),
            {
                reply_markup: TransferView.currencyKeyboard(wallet).reply_markup
            }
        );

        return ctx.wizard.next();
    }

    static async promptAmount(ctx: ExtendedContext) {
        const data = TelegramUtils.getCallbackData(ctx);
        const match = data.match(
            RegexUtils.matchActionCode(BOT.ACTION.TRANSFER_CURRENCY)
        );
        if (!match) {
            console.error("Unknown action");
            return;
        }

        ctx.wizard.state.emailTransfer.currency = match[1];

        await ctx.reply(
            LocaleUtils.getTransferText(ctx.i18n, "prompt.enterAmount"),
            {
                reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
            }
        );

        return ctx.wizard.next();
    }

    static async promptConfirmTransaction(ctx: ExtendedContext) {
        const amount = TelegramUtils.getMessageText(ctx);
        if (!isNumber(amount)) {
            await ctx.reply(
                LocaleUtils.getTransferText(ctx.i18n, "prompt.enterValidAmount")
            );
        }

        ctx.wizard.state.emailTransfer.amount = amount;

        const htmlContent = await TransferView.emailtransferSummary(
            ctx.i18n,
            ctx.wizard.state.emailTransfer
        );

        await ctx.reply(
            htmlContent,
            {
                reply_markup: TransferView.emailTransferKeyboard(ctx.i18n).reply_markup
            }
        );
    }

    static async sendEmailTransfer (ctx: ExtendedContext, next: () => Promise<void>) {
        const summary = ctx.wizard.state.emailTransfer;
        const token = ctx.session.copperX.token;
        
        const transaction = await (new TransferService()).sendEmailTransfer(
            summary,
            token
        );
        
        const htmlContent = await TransferView.transferSuccessHtml(
            ctx.i18n,
            transaction
        );

        await ctx.reply(htmlContent);

        return next();
    }
}