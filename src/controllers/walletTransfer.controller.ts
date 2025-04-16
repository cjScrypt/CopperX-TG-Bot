import { isEmail, isNumberString } from "class-validator";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { TransferService, WalletService } from "../services";
import { LocaleUtils, RegexUtils, StringUtils, TelegramUtils } from "../utils";
import { TransferView } from "../views";

export class WalletTransferController {
    static async promptAddress(ctx: ExtendedContext) {
        const prompt = LocaleUtils.getTransferText(ctx.i18n, "prompt.enterAddress");
        const msg = await ctx.reply(prompt, {
            reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
        });

        ctx.session.botMessageId = msg.message_id;
        ctx.session.deleteMessage = true;
        ctx.wizard.state.walletTransfer = {}

        return ctx.wizard.next();
    }

    static async promptPurposeCode(ctx: ExtendedContext) {
        const address = TelegramUtils.getMessageText(ctx);
        if (!address) {
            await ctx.reply(
                LocaleUtils.getTransferText(ctx.i18n, "error.invalidAddress"),
                {
                    reply_markup: TransferView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
            return;
        }

        ctx.wizard.state.walletTransfer.address = address;

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
            RegexUtils.matchActionCode(BOT.ACTION.TRANSFER_WALLET)
        );
        if (!purposeCode) {
            return;
        }

        ctx.wizard.state.walletTransfer.purposeCode = purposeCode[1];

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
        const actionIdArr = match[1].split("|");

        ctx.wizard.state.walletTransfer.currency = actionIdArr[0];
        ctx.wizard.state.walletTransfer.decimal = Number(actionIdArr[1]);

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
        if (!isNumberString(amount)) {
            await ctx.reply(
                LocaleUtils.getTransferText(ctx.i18n, "error.enterValidAmount")
            );
            return;
        }

        ctx.wizard.state.walletTransfer.amount = amount;

        const htmlContent = await TransferView.walletTransferSummary(
            ctx.i18n,
            ctx.wizard.state.walletTransfer
        );

        await ctx.reply(
            htmlContent,
            {
                parse_mode: "HTML",
                reply_markup: TransferView.sendTransferKeyboard(ctx.i18n).reply_markup
            }
        );

        return ctx.wizard.next();
    }

    static async sendWalletTransfer (ctx: ExtendedContext, next: () => Promise<void>) {
        const summary = ctx.wizard.state.walletTransfer;
        const token = ctx.session.copperX.token;
        
        summary.amount = StringUtils.convertDecimalToWhole(
            summary.amount || "0",
            summary.decimal
        );
        summary.decimal = undefined;

        const transaction = await (new TransferService()).sendWalletTransfer(
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