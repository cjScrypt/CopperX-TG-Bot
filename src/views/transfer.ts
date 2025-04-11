import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";
import { Markup } from "telegraf";
import { BOT, TRANSFER } from "../constants";
import { EmailTransferDto, WalletBalanceDto } from "../interfaces";
import { ConstantUtils, LocaleUtils } from "../utils";

export class TransferView {
    static getTransferMenuKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.TRANSFER_EMAIL),
                    BOT.ACTION.TRANSFER_EMAIL
                ),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.TRANSFER_WALLET),
                    BOT.ACTION.TRANSFER_WALLET
                ),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.TRANSFER_BANK),
                    BOT.ACTION.TRANSFER_BANK
                )
            ]            
        ]);
    }

    static getCancelKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            Markup.button.callback(
                LocaleUtils.getActionText(i18n, BOT.ACTION.CANCEL),
                BOT.ACTION.CANCEL
            )
        ]);
    }

    static paymentPurposeKeyboard(i18n: I18nContext) {
        const keyboard = [];
        let row = [];

        for (const purpose of Object.values(TRANSFER.PURPOSE)) {
            const actionKey = `transferPurpose.${purpose}`;
            row.push(
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, actionKey),
                    ConstantUtils.getActionData(BOT.ACTION.TRANSFER_EMAIL, purpose)
                )
            );

            if (row.length == 2) {
                keyboard.push(row);
                row = [];
            }
        }
        keyboard.push(row);

        const lastRow = [
            Markup.button.callback(
                LocaleUtils.getActionText(i18n, BOT.ACTION.CANCEL),
                BOT.ACTION.CANCEL
            )
        ]
        keyboard.push(lastRow);
        
        return Markup.inlineKeyboard(keyboard);
    }

    static currencyKeyboard(wallet: WalletBalanceDto) {
        const keyboard = [];
        let row = [];

        for (const balance of wallet.balances) {
            const currency = balance.symbol;

            const button = Markup.button.callback(
                `${currency} (${balance.balance})`,
                ConstantUtils.getActionData(
                    BOT.ACTION.TRANSFER_CURRENCY,
                    currency
                )
            );
            row.push(button);

            if (row.length === 6) {
                keyboard.push(row);
                row = []
            }
        }
        keyboard.push(row);

        return Markup.inlineKeyboard(keyboard);
    }

    static emailtransferSummary(
        i18n: I18nContext,
        summary: EmailTransferDto
    ) {
        return renderFile(resolve(__dirname, "./templates/emailTransferSummary.ejs"), {
            LocaleUtils,
            i18n,
            summary
        });
    }
}