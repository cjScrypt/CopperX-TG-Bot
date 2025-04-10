import { I18nContext } from "@grammyjs/i18n";
import { Markup } from "telegraf";
import { BOT } from "../constants";
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
}