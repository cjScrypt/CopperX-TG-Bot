import { I18nContext } from "@grammyjs/i18n";
import { Markup } from "telegraf";
import { BOT, TRANSFER } from "../constants";
import { LocaleUtils } from "../utils";

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
                    purpose
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
}