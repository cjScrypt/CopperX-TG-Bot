import { I18nContext } from "@grammyjs/i18n";
import { Markup } from "telegraf";
import { BOT } from "../constants";
import { LocaleUtils } from "../utils";

export class LoginView {
    static getLoginActionPrompt(i18n: I18nContext) {
        return LocaleUtils.getActionReplyText(i18n, "login.actionPrompt");
    }

    static getInvalidOtpKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.RESEND_OTP),
                    BOT.ACTION.RESEND_OTP
                ),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.CHANGE_EMAIL),
                    BOT.ACTION.CHANGE_EMAIL
                )
            ],
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.CANCEL),
                    BOT.ACTION.CANCEL
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
}