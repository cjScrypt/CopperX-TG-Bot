import { I18nContext } from "@grammyjs/i18n";
import { render } from "ejs";
import { resolve } from "path";
import { Markup } from "telegraf";
import { BOT } from "../constants";
import { CopperXSession } from "../interfaces";
import { LocaleUtils } from "../utils";


export class StartView {
    private static getHelpButton(i18n: I18nContext) {
        return Markup.button.callback(
            LocaleUtils.getActionText(i18n, BOT.ACTION.HELP),
            BOT.ACTION.HELP
        );
    }

    private static getSupportButton(i18n: I18nContext) {
        return Markup.button.callback(
            LocaleUtils.getActionText(i18n, BOT.ACTION.SUPPORT),
            BOT.ACTION.SUPPORT
        );
    }

    static getLoggedInKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.WALLET_MANAGEMENT),
                    BOT.ACTION.WALLET_MANAGEMENT
                ),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.SEND_TRANSFER),
                    BOT.ACTION.SEND_TRANSFER
                )
            ],
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.PROFILE),
                    BOT.ACTION.PROFILE
                ),
                this.getHelpButton(i18n)
            ],
            [
                this.getSupportButton(i18n),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.LOGOUT),
                    BOT.ACTION.LOGOUT
                )
            ]
        ]);
    }

    static getLoggedOutKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.LOGIN),
                    BOT.ACTION.LOGIN
                )
            ],
            [
                this.getHelpButton(i18n),
                this.getSupportButton(i18n)
            ]
        ]);
    }

    static getStartHtml(
        i18n: I18nContext,
        name: string,
        copperXSession?: CopperXSession
    ) {
        return render(resolve(__dirname, "templates/start.ejs"), {
            i18n,
            name,
            copperXSession
        });
    }
}